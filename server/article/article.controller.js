const Article = require('./article.model');

function load(req, res, next, id) {
  Article.get(id)
    .then((article) => {
      req.article = article;
      return next();
    })
    .catch(e => next(e));
}

function get(req, res) {
  return res.json(req.article);
}

function create(req, res, next) {

  const article = new Article({
    userId: req.body.userId,
    title: req.body.title,
    text: req.body.text,
    tags: req.body.tags
  });

  article.save()
    .then(savedArticle => res.json(savedArticle))
    .catch(e => next(e));
}

function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  Article.list({ limit, skip })
    .then(articles => res.json(articles))
    .catch(e => next(e));
}

function update(req, res, next) {
  const article = req.article;
  article.title = req.body.title;
  article.text = req.body.text;
  article.tags = req.body.tags
  article.userId = req.body.userId
  article.save()
    .then(savedArticle => res.json(savedArticle))
    .catch(e => next(e));
}

function remove(req, res, next) {
  const article = req.article;
  article.remove()
    .then(deletedArticle => res.json(deletedArticle))
    .catch(e => next(e));
}

module.exports = { load, create, update, list, remove, get };
