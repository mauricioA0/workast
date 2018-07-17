const Joi = require('joi');

module.exports = {
  // POST /api/users
  createUser: {
    body: {
      name: Joi.string().required(),
      avatar: Joi.string()
    }
  },

  // UPDATE /api/users/:userId
  updateUser: {
    body: {
      name: Joi.string().required(),
      avatar: Joi.string()
    },
    params: {
      userId: Joi.string().hex().required()
    }
  },

  // POST /api/auth/login
  login: {
    body: {
      username: Joi.string().required(),
      password: Joi.string().required()
    }
  },

  // POST /api/articles/articleID
  createArticle: {
    body: {
      title: Joi.string().required(),
      text: Joi.string().required(),
      tags: Joi.array().items(Joi.string(), Joi.any().strip()),
      userId: Joi.string()
    }
  },

  // UPDATE /api/articles/:articleId
  updateArticle: {
    body: {
      title: Joi.string().required(),
      text: Joi.string().required(),
      tags: Joi.array().items(Joi.string(), Joi.any().strip()),
      userId: Joi.string()
    },
    params: {
      articleId: Joi.string().required()
    }
  },
};
