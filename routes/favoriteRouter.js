const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate')
var Favorites = require('../models/favorite');
const cors = require('./cors');


const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.cors,authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({user:req.user._id})
            .populate('user')
            .populate('dishes')
            .exec((err,favorites)=>{
                if(err) return next(err);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorites);
            });
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        /*//*/
        //here1
        Favorites.findOne({user: req.user._id},(err,favorite)=>{        
            if(err) return next(err);
            //.then((favorite) => {
                if (!favorite) {
                    Favorites.create({user:req.user._id})
                        .then((favorite) => {
                            for(i=0;i<req.body.length;i++)
                                if(favorite.dishes.indexOf(req.body[i]._id)<0)
                                    favorite.dishes.push(req.body[i]);
                            favorite.save()
                            .then((favorite)=>{
                                Favorites.findById(favorite._id)
                                .populate('user')
                                .populate('dishes')
                                .then((favorite)=>{
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(favorite);
                                })
                            }).catch((err) =>  {return next(err)});
                        }).catch((err) =>  {return next(err)});
                            
                        
                } else {
                    for(i=0;i<req.body.length;i++)
                     if(favorite.dishes.indexOf(req.body[i]._id)<0)
                                    favorite.dishes.push(req.body[i]);
                    favorite.save()
                    .then((favorite)=>{
                        Favorites.findById(favorite._id)
                                .populate('user')
                                .populate('dishes')
                                .then((favorite)=>{
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(favorite);
                                })
                    }).catch((err)=>{
                        return next(err);
                    });
                    
                }
            });
            //}, (err) => next(err))
            //.catch((err) => next(err));

            /*
            Favorites.findOne({user: req.user._id},(err,favorite))        
            if(err) return next(err);
            //.then((favorite) => {
                if (!favorite) {
                    Favorites.create({user:req.user._id})
                        .then((favorite) => {
                            for(i=0;i<req.body.length;i++)
                                if(favorite.dishes.indexOf(req.body[i]._id)<0)
                                    favorite.dishes.push(req.body[i]);
                            favorite.save()
                            .then((favorite)=>{
                                Favorites.findById(favorite._id)
                                .populate('user')
                                .populate('dishes')
                                .then((favorite)=>{
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(favorite);
                                }, (err) => next(err))
                                .catch((err) =>  {return next(err)});
                            }, (err) => next(err))
                            .catch((err) =>  {return next(err)});
                        }, (err) => next(err))
                        .catch((err) =>  {return next(err)});
                            
                        
                } else {
                    for(i=0;i<req.body.length;i++)
                     if(favorite.dishes.indexOf(req.body[i]._id>0))
                                    favorite.dishes.push(req.body[i]);
                    favorite.save()
                    .then((favorite)=>{
                        Favorites.findById(favorite._id)
                                .populate('user')
                                .populate('dishes')
                                .then((favorite)=>{
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(favorite);
                                }, (err) => next(err))
                                .catch((err) => next(err));
                    }, (err) => next(err))
                    .catch((err)=>{
                        return next(err);
                    });
                    
                }
            //}, (err) => next(err))
            //.catch((err) => next(err));
            
            */
    })
    .put(cors.cors, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.setHeader('Content-Type', 'application/json');
        res.end('PUT operation not supported on /dishes');
    })
    .delete(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOneAndRemove({user:req.user._id},(err,resp)=>{
                if(err) return next(err);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
           
    });
});

favoriteRouter.route('/:dishId')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.cors, authenticate.verifyUser, (req,res,next) => {
        Favorites.findOne({user: req.user._id})
        .then((favorites) => {
            if (!favorites) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.json({"exists": false, "favorites": favorites});
            }
            else {
                if (favorites.dishes.indexOf(req.params.dishId) < 0) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    return res.json({"exists": false, "favorites": favorites});
                }
                else {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    return res.json({"exists": true, "favorites": favorites});
                }
            }
    
        }, (err) => next(err))
        .catch((err) => next(err))
    })
    .post(cors.cors, authenticate.verifyUser, (req, res, next) => {
        //rightone
        Favorites.findOne({user: req.user._id},(err,favorite)=>{
        if(err) return next(err);
        if(!favorite){
            Favorites.create({user: req.user._id})
            .then((favorite) =>{
                favorite.dishes.push({"_id":req.params.dishId})
                favorite.save()
                .then((favorite)=>{
                    Favorites.findById(favorite._id)
                                .populate('user')
                                .populate('dishes')
                                .then((favorite)=>{
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(favorite);
                                })
                }).catch((err)=>{
                    return next(err);
                });
            }).catch((err)=>{return next(err);})
        }else{
            if (favorite.dishes.indexOf(req.params.dishId) < 0) {                
                favorite.dishes.push(req.params.dishId);
                favorite.save()
                .then((favorite) => {
                    Favorites.findById(favorite._id)
                    .populate('user')
                    .populate('dishes')
                    .then((favorite) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorite);
                    })
                })
                .catch((err) => {
                    return next(err);
                })
            }else{
                res.statusCode=403;
                res.setHeader('Content-Type','text/plain');
                res.end('Dish'+req.params.dishId+'already add')
            }
        }
    });

        /*Favorites.findOne({'user': req.user._id }) 
    .then((favorite) => {  
        if(favorite !== null){
           //user found search for favorite dish exists
            if (favorite.dishes.indexOf(req.params.dishId)>=0){ //id (req.params.dishId ) != null){
                //update not allow, because is already a favorite dish
                err = new Error ('Dish '+ req.params.dishId + ' already as favorite');
                err.status = 300;
                return next (err);
            }
            else {
                //if dish not exist add it
                favorite.dishes.push(req.params.dishId);
                favorite.save()
                .then((favorite)=>{
                    Favorites.findById(favorite._id)
                    .populate('user')
                    .populate('dishes')
                    .then((favorite)=>{
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorite);
                    }, (err) => next(err))
                    .catch((err) =>  {return next(err)});
                    
                }, (err) => next(err))
                .catch((err) =>  {return next(err)});
            }
        }
        else{
            //not found add user and favorite dish 
            console.log('Favorite user created');
            const favoriteNew = new Favorites({ user: req.user._id }); 
            Favorites.create(favoriteNew)
            .then((newFavorite) => {
                console.log('Favorite user created', newFavorite);
                
                newFavorite.dishes.push (req.params.dishId);
                newFavorite.save()
                .then((newFavorite)=>{
                    Favorites.findById(favorite._id)
                    .populate('user')
                    .populate('dishes')
                    .then((newFavorite)=>{
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(newFavorite);
                    }, (err) => next(err))
                    .catch((err) =>  {return next(err)});
                    
                }, (err) => next(err))
                .catch((err) =>  {return next(err)});

            }, (err) => next(err))
            .catch((err) => next(err));
        }
    }, (err) => next(err))
    .catch((err) => next(err));*/
//okay
   /* Favorites.findOne({user: req.user._id})        
        
            .then((favorite) => {
                if (favorite == null) {
                    Favorites.create({user:req.user._id})
                        .then((favorite) => {
                     favorite.dishes.push(req.params.dishId);
                              favorite.save()
                            .then((favorite)=>{
                                Favorites.findById(favorite._id)
                                .populate('user')
                                .populate('dishes')
                                .then((favorite)=>{
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(favorite);
                                }, (err) => next(err))
                                .catch((err) =>  {return next(err)});
                                
                            }, (err) => next(err))
                            .catch((err) =>  {return next(err)});
                        }, (err) => next(err))
                        .catch((err) =>  {return next(err)});
                            
                        
                } else {
                    if (favorite.dishes.indexOf(req.params.dishId < 0)) {                
                        favorite.dishes.push(req.body);
                        favorite.save()
                        .then((favorite) => {
                            Favorites.findById(favorite._id)
                            .populate('user')
                            .populate('dishes')
                            .then((favorite) => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(favorite);
                            })
                        })
                        .catch((err) => {
                            return next(err);
                        })
                    }else{
                        res.statusCode = 403;
                        res.setHeader('Content-Type', 'text/plain');
                        res.end('Dish '+ req.params.dishId+ 'already');
                    }
                }
            }, (err) => next(err))
            .catch((err) => next(err));*/

            
    



    })
    .put(cors.cors, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
                        res.setHeader('Content-Type', 'text/plain');
                        res.end('PUT operation not supported on /favorites '+ req.params.dishId);
    })
    .delete(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({user: req.user._id},(err,favorite)=>{
            if(err) return next(err);
            var index = favorite.dishes.indexOf(req.params.dishId);
            if(index>=0){
                favorite.dishes.splice(index,1);
                favorite.save()
                .then((favorite)=>{
                    Favorites.findById(favorite._id)
                            .populate('user')
                            .populate('dishes')
                             .then((favorite) => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(favorite);})
                }).catch((err)=>{return next(err);})
            }
            else{
                res.statusCode = 404;
                            res.setHeader('Content-Type', 'text/plain');
                            res.end('Dish '+ req.params._id+'not in')
            }
        });
    });

module.exports = favoriteRouter;






