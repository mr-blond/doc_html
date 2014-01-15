 "use strict";

            $(function() {

                


               window.GestionnairePage = function(container){

                    this.templateCouverture = "";
                    this.templatePage = "";
                    this.contenu = '';
                    this.currentPage = '';
                    var nbPage = 1;
                    var tailleConteneur = 580;
                    var that = this;
                    
                    var $container = container;
                    this.createCouverture = function(){
                       // console.log(this.templateCouverture);
                        $container.append(this.templateCouverture);
                      
                    };
                    this.createPage = function(){
                        console.log('création d\'une page');
                        var page = new Page($container,this.templatePage,nbPage++);
                        
                
                        this.currentPage = page;
                    };
                    this.fillPage = function(contenu){
                        if(nbPage === 1){
                            this.createPage(nbPage);
                        }
                    //on remplie jusqu'a ce qu'on recoive un evenement
                        var leBlock;
                        var nbBlock = $(this.contenu).filter('.block').length;
                        for(var i=0;i<nbBlock;i++){
                            leBlock = $(this.contenu).filter('.block:eq('+i+')');
                           
                            if(that.currentPage.isFull || that.currentPage.isTooBig ){

                                //on récupére le contenu en trop
                                var exeded = that.currentPage.exededNode;
                                //on supprime ce qui avait été ajouté
                                that.currentPage.removeLastNode();

                                //et on le met sur une nouvelle page
                                
                                if(that.currentPage.isTooBig){
                                    console.log('je decoupe');
                                    console.log($(exeded));
                                    i++;
                                }else{
                                    //je decoupe
                                    that.createPage();
                                    console.log('dans is full')
                                    that.currentPage.addContent(exeded);
                                }
                                    
                                
                                i--;
                            }else{
                                that.currentPage.addContent(leBlock);
                            }
                        
                        };

                    };
               }
               window.Page = function($container,templatePage,index){
                    this.isFull = false;
                    this.isTooBig = false;
                    var tailleConteneur = 580;
                    $container.append($(templatePage).addClass('page' + index));
                    
                    //La ou je dois ajouter le contenu
                    var $content = $('.content:last');
                    this.exededNode = '';

                    this.addContent = function(node){

                        //console.log('ajout de contenu');
                        
                        //tester si on peut ajouter le contenu
                        $content.append(node);
                        if($(node).height() > tailleConteneur){
                             console.log('is Too big');
                             this.isTooBig = true;
                             this.exededNode = node;
                        }else if( $content.height()  > tailleConteneur){

                            console.log('is full');
                            //on enleve le dernier noeud ajouté

                            this.exededNode = node;
                            this.isFull = true;
                            
                        }
                       
                    }

                    this.removeLastNode = function(){
                        this.exededNode.remove();
                    }
               }


              
                window.gestionnaire = new window.GestionnairePage($('#wrapper'));
               var d1 = $.get('contenu.html', function(data) {                           
                    gestionnaire.contenu = data;
                });   

                var d2 = $.get('template_couverture.html', function(data) {                            
                    gestionnaire.templateCouverture = data;
                }); 

                var d3 = $.get('template_page.html', function(data) {
                    
                    gestionnaire.templatePage = data;
                }); 
                
            //On lance les requetes et on attend que celle ci soit terminé
                $.when(d1,d2,d3).done(function() {
                   
                     //créer une premiére page 
                  
                    gestionnaire.createCouverture();
                    //on lance le remplissage des pages
                   gestionnaire.fillPage();
                     
                });

  
            });