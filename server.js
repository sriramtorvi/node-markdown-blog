const express = require('express');
const mongoose = require('mongoose')
const Article = require('./models/article')
const articleRouter = require('./routes/articles')
const methodOverride = require('method-override')
const app = express();

mongoose.connect('mongodb://localhost/blog',{ useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

app.set('view engine','ejs');
app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'));
app.use('/articles',articleRouter);


app.get('/', (req,res) => {
    Article.find()
            .sort({createdAt: -1})
            .then(articles => {
                res.render('articles/index', {articles: articles })
            })
});


app.listen(5000);  