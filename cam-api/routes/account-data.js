jwt = require 'jsonwebtoken'
bcrypt = require 'bcrypt'

encrypt = (saltWorkFactor, password, cb) ->
  return cb() if not password?
  bcrypt.genSalt saltWorkFactor, (err, salt) ->
    return cb err if err?
    bcrypt.hash password, salt, cb

module.exports = (seneca, settings, validators, handleErrors) ->
  seneca.add (role: 'account-data', cmd: 'add'), (data,done) ->
    seneca = @
    try
      return done null, error: { message:  'validation failed', errors: [ message: 'no data' ] } if not data.account?
      account = seneca.util.clean data.account
      validate = validators.get seneca, 'account_add'
      onValidate = (valid) ->
        encrypt settings.saltWorkFactor, account.password, (err, hash) ->
          return handleErrors(seneca,done,err,data) if err?
          account.password = hash
          _account = seneca.make('account')
          _account.data$ account
          _account.save$ (err,account) ->
            return handleErrors(seneca,done,err,data) if err?
            seneca.act
              role: 'data-notification'
              target: 'account'
              action:
                type: 'add'
                actual: account.data$(false)
            done null, account.data$(false)
      onError = (errors) ->
        done null, error: errors
      validate(account).then(onValidate).catch(onError)
    catch err
      handleErrors(seneca,done,err,data)
  seneca.add (role: 'account-data', cmd: 'update'), (data,done) ->
    seneca = @
    try
      return done null, error: { message:  'validation failed', errors: [ message: 'no data' ] } if not data.account?
      account = seneca.util.clean data.account
      validate = validators.get seneca, 'account_update'
      onValidate = (valid) ->
        encrypt settings.saltWorkFactor, account.password, (err, hash) ->
          return handleErrors(seneca,done,err,data) if err?
          account.password = hash if hash?
          seneca.make('account').load$ account.id, (err, _account) ->
            return handleErrors(seneca,done,err,data) if err?
            if !_account?
              done null, error: (message: 'validation failed', errors: [ dataPath: '.id', message: 'account not found' ])
            else
              previous = _account.data$(false)
              delete account.id
              _account.data$(account)
              _account.save$ (err,account) ->
                return handleErrors(seneca,done,err,data) if err?
                seneca.act
                  role: 'data-notification'
                  target: 'account'
                  action:
                    type: 'update'
                    previous: previous
                    actual: account.data$(false)
                done null, account.data$(false)
      onError = (errors) ->
        done null, error: errors
      validate(account).then(onValidate).catch(onError)
    catch err
      handleErrors(seneca,done,err,data)
  seneca.add (role: 'account-data', cmd: 'authenticate'), (data,done) ->
    seneca = @
    try
      return done null, error: 'authentication error' if not data.account?.password? or not data.account?.email?
      seneca.make('account').load$ (email: data.account.email), (err,account) ->
        return handleErrors(seneca,done,err,data) if err?
        return done null, error: 'authentication error' if not account?
        bcrypt.compare data.account.password, account.password, (err, isMatch) ->
          return handleErrors(seneca,done,err,data) if err?
          return done null, error: 'authentication error' if not isMatch
          token = jwt.sign((id: account.id),settings.jwtSecret,(expiresIn: settings.expiresIn))
          done null, token: token
    catch err
      handleErrors(seneca,done,err,data)
  seneca.add (role: 'account-data', cmd: 'list'), (data,done) ->
    seneca = @
    try
      if data.client?
        seneca.make('account').list$ client: data.client, sort$: (name: 1) , (err, list) ->
          return handleErrors(seneca,done,err,data) if err?
          done null, list: list.map (item) -> item.data$ false
      else
        seneca.make('account').list$ sort$: (name: 1) , (err, list) ->
          return handleErrors(seneca,done,err,data) if err?
          done null, list: list.map (item) -> item.data$ false
    catch err
      handleErrors(seneca,done,err,data)
  seneca.add (role: 'account-data', cmd: 'remove'), (data,done) ->
    return done null, error: (message: 'validation failed', errors: [ dataPath: '.id', message: 'should have required property \'id\'' ]) if !data.account?.id?
    seneca = @
    try
      seneca.make('account').load$ data.account.id, (err, _account) ->
        return handleErrors(seneca,done,err,data) if err?
        return done null, error: (message: 'validation failed', errors: [ dataPath: '.id', message: 'account not found' ]) if not _account?
        return done null, _account if _account.error?
        previous = _account.data$(false)
        seneca.make('account').remove$ data.account.id , (err) ->
          return handleErrors(seneca,done,err,data) if err?
          seneca.act
            role: 'data-notification'
            target: 'account'
            action:
              type: 'remove'
              previous: previous
          done null, message: 'account removed'
    catch err
      handleErrors(seneca,done,err,data)
  seneca.add (role: 'account-data', cmd: 'get'), (data,done) ->
    return done null, error: (message: 'validation failed', errors: [ dataPath: '.id', message: 'should have required property \'id\'' ]) if !data.account?.id?
    seneca = @
    try
      seneca.make('account').load$ data.account.id , (err, account) ->
        return handleErrors(seneca,done,err,data) if err?
        return done null, error: (message: 'account not found', errors: [ dataPath: '.id', message: 'account not found' ]) if !account?
        done null, account.data$ false
    catch err
      handleErrors(seneca,done,err,data)
