// 格式化本地和来自服务器的数据

export const parseFromLocal =  (type, to, message = {}, bodyType) => {
  let ext = message.ext || {}
  let obj = copy(message, msgTpl.base)
  let body = copy(message, msgTpl[bodyType])
  return {
    ...obj,
    type,
    to,
    id: WebIM.conn.getUniqueId(),
    body: {
      ...body,
      ...ext,
      type: bodyType
    }
  }
}

// unify message format: server side
export const parseFromServer = (message = {}, bodyType) => {
  let ext = message.ext || {}
  let obj = copy(message, msgTpl.base)
  // all of entities of message should in body, not in base
  // body.ext could save any customize info of message, like image size, width, height etc
  let body = copy(message, msgTpl[bodyType])
  switch (bodyType) {
    case 'txt':
      return {
        ...obj,
        status: 'sent',
        body: {
          ...body,
          ...ext,
          msg: message.data,
          type: 'txt'
        }
      }
      break
    case 'img':
      return {
        ...obj,
        status: 'sent',
        body: {
          ...body,
          ...ext,
          type: 'img'
        }
      }
      break
    case 'file':
      return {
        ...obj,
        status: 'sent',
        body: {
          ...body,
          ...ext,
          type: 'file'
        }
      }
      break
    case 'audio':
      return {
        ...obj,
        status: 'sent',
        body: {
          ...body,
          ...ext,
          type: 'audio'
        }
      }
      break
    case 'video':
      return {
        ...obj,
        status: 'sent',
        body: {
          ...body,
          ...ext,
          type: 'video'
        }
      }
      break
  }
}

const msgTpl = {
  base: {
    error: false,
    errorCode: '',
    errorText: '',
    // if status is blank, it's treated as "sent" from server side
    status: 'sending', // [sending, sent ,fail, read]
    id: '',
    // from - room id need it,should not be deleted
    from: '',
    to: '',
    toJid: '',
    time: '',
    type: '', // chat / groupchat
    body: {},
    ext: {},
    bySelf: false
  },
  txt: {
    type: 'txt',
    msg: ''
  },
  img: {
    type: 'img',
    file_length: 0,
    filename: '',
    filetype: '',
    length: 0,
    secret: '',
    width: 0,
    height: 0,
    url: '',
    thumb: '',
    thumb_secret: ''
  },
  file: {
    type: 'file',
    file_length: 0,
    filename: '',
    filetype: '',
    length: 0,
    secret: '',
    width: 0,
    height: 0,
    url: '',
    thumb: '',
    thumb_secret: ''
  },
  video: {
    type: 'video',
    file_length: 0,
    filename: '',
    filetype: '',
    length: 0,
    secret: '',
    width: 0,
    height: 0,
    url: '',
    thumb: '',
    thumb_secret: ''
  },
  audio: {
    type: 'audio',
    file_length: 0,
    filename: '',
    filetype: '',
    length: 0,
    secret: '',
    width: 0,
    height: 0,
    url: '',
    thumb: '',
    thumb_secret: ''
  }
}

function copy(message, tpl) {
  let obj = {}
  Object.keys(tpl).forEach(v => {
    obj[v] = message[v] || tpl[v]
  })
  return obj
}