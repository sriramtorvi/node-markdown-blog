const express = require('express');
const Article = require('./../models/article');
const router = express.Router();

router.get('/new', (req,res) => {
    res.render('articles/new', { article: new Article() });
})

router.get('/edit/:id', (req,res) => {
    Article.findById(req.params.id)
            .then(article => res.render('articles/edit' , { article: article }))
    
})

router.get('/:slug',(req,res) => {
    Article.findOne({slug: req.params.slug})
            .then(article => {
                if(article == null) res.render("/")
                res.render('articles/show', {article: article})
            })
            .catch(e => console.log(e))
})

router.post('/', (req,res,next) => {
    req.article = new Article();
    next();
},saveArticleAndRedirect('new'))

router.put('/:id', (req,res,next) => { 
    Article.findById(req.params.id).then(article => {
        req.article = article
        next();
    }) 
},saveArticleAndRedirect('edit'))

router.delete('/:id',(req, res) => {
    Article.findByIdAndDelete(req.params.id)
            .then(() => res.redirect('/'))
})


function saveArticleAndRedirect(path) {
    return async (req, res) => {
        let article = req.article
        article.title = req.body.title
        article.description = req.body.description
        article.markdown = req.body.markdown
        article.save()
                .then(result => {
                    res.redirect(`/articles/${result.slug}`)
                })
                .catch(e => {
                    console.log(e);
                    res.render(`articles/${path}`, {article: article});
                })
    }
}

module.exports = router;