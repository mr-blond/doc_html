 "use strict";

            $(function() {

                

                window.parser = {
                    templateCouverture : '',
                    templatePage:'',
                    contenu:'',
                    $currentPage:'',
                    nbPage : '1'
                    

                }

               
                var tailleConteneur  = 580;
                var $container = $("#wrapper");

            //on prépare les requetes pour recuperer le contenu et les templates;
                var d1 = $.get('contenu.html', function(data) {                           
                    parser.contenu = data;
                });   

                var d2 = $.get('template_couverture.html', function(data) {                            
                    parser.templateCouverture = data;
                }); 

                var d3 = $.get('template_page.html', function(data) {
                    
                    parser.templatePage = data;
                }); 
                
            //On lance les requetes et on attend que celle ci soit terminé
                $.when(d1,d2,d3).done(function() {

                    onDownLoadComplete();
                     
                });
               
                function onDownLoadComplete(){
                    $container.append(parser.templateCouverture);
                     //créer une premiére page 
                    createPage();
                    //on lance le remplissage des pages
                    fillPage();

                }
               function createPage(){
                    $container.append(parser.templatePage);
                    parser.nbPage++;
                    parser.$currentPage = $( ".page:last" );
               }
               function fillPage(){
                    //on récupére la derniere page créer pour en faire la page sur la quelle on travail
                    
                    //on y insere Block par block le contenu 
                    var $blockContent;
                    $(parser.contenu).filter('.block').each(function(index,leBlock){

                        $blockContent = parser.$currentPage.find('.content:last');
 
                        //faire un test pour savoir si il faut creer une nouvelle page
                        $blockContent.append(leBlock);

                      //si le block est trop gros pour etre affiché sur une page, le decouper
                      if($(leBlock).height() > tailleConteneur ){
                         console.log('-------------------------Decoupage d\'un block)');
                         $(leBlock).children('*').each(function(index,leNoeud){
                            console.log(leNoeud);
                         });
                      }if( $blockContent.height()  > tailleConteneur){
                            


                            
                            console.log('taille de la page : ' + $blockContent.height() );
                            //on déplace le block dans la page suivante
                            parser.$currentPage.remove('.block:last')
                            createPage();
                            $blockContent = parser.$currentPage.find('.content:last');
                            $blockContent.append(leBlock);                
                            
                        }

                        // à  la fin de la page, ajouter son numéro
                        parser.$currentPage.find(".page-actuel").html(parser.nbPage);
                       

                    });
                    //une fois la boucle terminé j'ajoute à chaque page le nombre total de page
                    $(".page-total").html(parser.nbPage)

               }
  
            });