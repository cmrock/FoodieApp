
window.myfoodApp = angular.module('myfoodApp', ['ui.bootstrap','ngAnimate']);
/*
* @description
* MIService returns list of basic ingredients that everyone has at home.
* */
myfoodApp.factory('MIService',function(){
    var MIS = [ "Apples","Akudjura","Almond","Apricot","Jam","Avocado","Beef","Bacon","Baking Powder","Banana","Bay Leaf","Bean","Beef",
                "Beef (Mince)","Beer","Biscuits","Bocconcini","Bread","Broccoli","Butter","Butter","Cabbage","Cacao Powder","Capsicum",
                "Cardamom","Carrot","Cheese","Cherries","Chicken","Chilli","Chocolate","Chutney","Cinnamon","Cloves","Cocoa Powder","Coriander",
                "Corn","Cream","Cucumber","Cumin Seeds","Curry","Duck","Egg","Fig","Fish","Garam Masala","Garlic","Ghee","Ginger","Grapes","Honey",
                "Ice Cream","Jam","Kiwi","Lamb","Lemon","Mango","Mayonnaise","Meat","Milk","Mint","Mushrooms","Mustard","Noodles","Oats","Oil","Onion",
                "Orange","Paneer","Paprika","Pasta","Pastry","Peanuts","Pepper","Pesto","Pineapple","Pizza","Pork","Potato","Pumpkin","Rice","Rum",
                "Saffron","Salami","Salmon","Salt","Spaghetti","Spinach","Sugar","Sugo","Sweet Chil Sauce","Tacos","Tamarind","Tofu","Tomato",
                "Tomatoes","Vanilla","Vinegar","Wholemeal","Wine","Yogurt"
              ];
    return MIS;
});

/*
* @description
* recipeCtrl is the Main Controller of the app
* */
myfoodApp.controller('recipeCtrl',['$scope','$http','MIService','$filter','$location', function ($scope,$http,MIService,$filter,$location) {

        // Initialize the scope defaults.
        $scope.recipes = [];
        $scope.data = [];
        $scope.kitchen = [];
        $scope.exclusion = [];
        $scope.new_ing = undefined;
        $scope.ingnames= MIService;
        $scope.logged_in= false;
        $scope.saved_recipes = [];
        $scope.ing_excl='';
        $scope.clearSearch = function () {
            $scope.searchAll = "";
        };

        $scope.myInterval = 3000;

        // Initializing  slide array
        $scope.slides = [
            {image:'images/image1.jpg'},
            {image:'images/bigoven-turkey.jpg'},
            {image:'images/BLT-On-A-Stick.jpg'},
            {image:'images/pancakes.jpg'}
        ];

        var slides = $scope.slides;

        $scope.remove_all_ingredients = function() {
            if (!confirm('Are you sure you want to remove all your ingreidents?')) {
                return false;
            }
            $scope.reset();
        };

        $scope.reset = function() {
            $scope.kitchen = [];
            $scope.focused = '';
            $scope.recipes = [];

        };

        $scope.user  = {username:'',password:''};
        $scope.alert = '';

        /*
        * @description
        * login function
        * */
        $scope.login = function(user){
            $http.post('/auth/login', user).
                success(function(data) {
                    $scope.loggeduser = data;
                    $scope.logged_in = true;
                    $scope.jumbotron_closed = true;
                    $(".ccc").hide();
                    $("#signup_modal").modal('hide');
                    $(".navbar-collapse").removeClass("in").addClass("collapse");
                    $location.path('/');
                }).
                error(function() {
                    $scope.alert = 'Login failed'
                });

        };

        /*
        * @description
        * sign up function for the new users
        * */
        $scope.signup = function(user){
            $http.post('/auth/signup', user).
                success(function(data) {
                    $scope.alert = data.alert;
                    $scope.login(user);
                   }).
                error(function() {
                    $scope.alert = 'Registration failed'
                });

        };
        /*
        * @description
        * logout function
        * */
        $scope.logout = function(){
            $http.get('/auth/logout')
                .success(function() {
                    $scope.kitchen = [];
                    $scope.logged_in = false;

                    $scope.recipes = [];
                    $(".navbar-collapse").removeClass("in").addClass("collapse"); //close nav
                    $scope.loggeduser = {};
                    $location.path('/');

                })
                .error(function() {
                    $scope.alert = 'Logout failed'
                });
        };

        $scope.toggle_save = function(rname,img,url) {
            if ($scope.is_saved(rname)) {

                $scope.remove_saved_recipe(rname);
                //$scope.savedrecipes();
            } else {
                $scope.save_recipe(rname,img,url);
            }
        };
        $scope.is_saved = function(rname) {

            if ($scope.saved_recipes.indexOf(rname) > -1) {

                return true;
            } else {
                return false;
            }
        };
        /*
        * save_recipe Function to save the recipes into account
        * */
        $scope.save_recipe = function(rname,img,url) {
            if (!$scope.logged_in) {
                if (confirm("You need to be signed in to save recipes.  Would you like to register? It's free!")) {
                    $('#signup_modal').modal('show');
                }
                return false;
            }
            var re_name = encodeURIComponent(rname);
            var re_img = encodeURIComponent(img);
            var re_url = encodeURIComponent(url);
            $http.post('http://localhost:6060/AddFav/'+ $scope.loggeduser.email + '/' + re_name + '/' + re_img + '/' + re_url ).
                success(function(data) {

                    $scope.saved_recipes.push(rname);
                });
        };
        /*
        * @description
        * savedrecipes function to get all saved recipes
        * */
        $scope.savedrecipes=function(){
            $scope.kitchen=[];
            if (!$scope.logged_in) {
                alert('must be signed in to save');
                return false
            }

            $http.get('http://localhost:6060/getAllFav/'+$scope.loggeduser.email).
                success(function(data){
                   $scope.recipes=data;
                }).error(function(response){
                    console.log("error");
                });
            $scope.jumbotron_closed = true;
            $(".ccc").hide();
        };
        /*
        * @description
        * remove_saved_recipe function to remove recipe from saved recipes
        * */
        $scope.remove_saved_recipe = function(rname) {
            if (!$scope.logged_in) {
                alert('must be signed in to save');
                return false
            }
            $http.put('http://localhost:6060/delFav/'+ $scope.loggeduser.email +'/' + rname ).
                success(function(data) {
                    $scope.saved_recipes.splice($scope.saved_recipes.indexOf(rname), 1);
                });

        };
        /*
        * @description
        * function to get recipe by recipe name
        * */
        $scope.searchByRecipeName = function(){
            $http.get('http://localhost:6060/searchByRecipeName/'+$scope.query +'/500').
                success(function(data) {
                    $scope.recipes = data;

                }).error(function(response){
                    console.log("error");
                });
            $scope.query='';
            $(".ccc").hide();
            $scope.jumbotron_closed = true;

        };

        /*
        * @description
        * function get recipe by ingredients name
        * */
        $scope.searchByIngredients = function(){

            $scope.index = $.inArray($scope.new_ing,$scope.kitchen);
            if($scope.index==-1){
                $scope.index_ex = $.inArray($scope.new_ing,$scope.exclusion);

                if($scope.index_ex!==-1){
                    alert('already exist in exclusion');
                }
                else{
                $scope.kitchen.push($scope.new_ing);
                }
            }else{
                alert("already exist in kitchen!");
            }

            console.log($scope.exclusion.length);

                if($scope.exclusion.length==0){
                    $http.get('http://localhost:6060/searchByIngredients/'+JSON.stringify($scope.kitchen)+'/500').
                        success(function(data) {
                            $scope.recipes = data;

                        }).error(function(response){
                            console.log("error");
                        });

                    $scope.new_ing='';
                    $scope.jumbotron_closed = true;
                }
                else {
                    console.log($scope.exclusion);
                    console.log('http://localhost:6060/searchWithExclusion/'+JSON.stringify($scope.kitchen)+'/'+$scope.exclusion+'/500');
                    $http.get('http://localhost:6060/searchWithExclusion/'+JSON.stringify($scope.kitchen)+'/'+$scope.exclusion+'/500').
                    success(function(data) {
                        $scope.recipes = data;

                    }).error(function(response){
                        console.log("error1");
                });
                    $scope.new_ing='';
                    $scope.jumbotron_closed = true;
                }

           // $scope.new_exclusion='';
            $scope.new_ing='';
            $scope.jumbotron_closed = true;
        };

        /*
        * @description
        * Function to get recipes with excluded ingredients
        * */
        $scope.searchwithExclusion=function(){

            $scope.index = $.inArray($scope.new_exclusion,$scope.exclusion);
            if($scope.index==-1){
                $scope.index_ex = $.inArray($scope.new_exclusion,$scope.kitchen);

                if($scope.index_ex!==-1){
                    alert('already exist in kitchen');
                }
                else{
                    $scope.exclusion.push($scope.new_exclusion);
                }
            }else{
                alert("already exist in exclusion!");
            }
            $http.get('http://localhost:6060/searchWithExclusion/'+JSON.stringify($scope.kitchen)+'/'+$scope.exclusion+'/500').
                success(function(data) {
                    $scope.recipes = data;

                }).error(function(response){
                    console.log("error1");
                });
            $scope.new_ing='';
            $scope.jumbotron_closed = true;
            $scope.new_exclusion='';

        };

        $scope.ing_sort = function(recipe) {


        };
        var pagesShown = 1;
        var pageSize = 24;

        $scope.paginationLimit = function(data) {
            return pageSize * pagesShown;
        };
        $scope.hasMoreItemsToShow = function() {
            return pagesShown < ($scope.recipes.length / pageSize);

        };
        $scope.showMoreItems = function() {
            pagesShown = pagesShown + 1;
        };

        /*
        * @description
        * Function to remove ingredients from searching scope area
        * */
        $scope.removeIngredient = function(name){
            while($.inArray(name,$scope.kitchen)!=-1){
                $scope.kitchen.splice($.inArray(name,$scope.kitchen), 1);
            }

            $http.get('http://localhost:6060/searchByIngredients/'+JSON.stringify($scope.kitchen)+'/500').
                success(function(data) {
                    $scope.recipes = data;
                }).error(function(response){
                    console.log("error");
                });

            $scope.recipes= [];

        };
        /*
        * @description
        * Function to remove ingredients from exclusion scope area
        * */
        $scope.exclusion_remove=function(data) {
            while ($.inArray(data, $scope.exclusion) != -1) {
                $scope.exclusion.splice($.inArray(data, $scope.exclusion), 1);
            }

            if ($scope.exclusion.length == 0) {
                $http.get('http://localhost:6060/searchByIngredients/' + JSON.stringify($scope.kitchen) + '/500').
                    success(function (data) {
                        $scope.recipes = data;

                    }).error(function (response) {
                        console.log("error");
                    });

                $scope.new_ing = '';
                $scope.jumbotron_closed = true;
            }
            else {
                console.log($scope.exclusion);
                console.log('http://localhost:6060/searchWithExclusion/' + JSON.stringify($scope.kitchen) + '/' + $scope.exclusion + '/500');
                $http.get('http://localhost:6060/searchWithExclusion/' + JSON.stringify($scope.kitchen) + '/' + $scope.exclusion + '/500').
                    success(function (data) {
                        $scope.recipes = data;

                    }).error(function (response) {
                        console.log("error1");
                    });
                $scope.new_ing = '';
                $scope.jumbotron_closed = true;
            }
        };

        /*
        * @description
        * Function to get random recipes of the day.
        * */
        $scope.surprizeMe = function(){
            $scope.new_ing = '';
            $scope.jumbotron_closed = true;
            $http.get('http://localhost:6060/surprize')
                .success(function (data) {
                    $scope.recipes = data;

                }).error(function (response) {
                    console.log("error1");
                });
            //$scope.new_ing = '';
            $(".ccc").hide();
            $scope.jumbotron_closed = true;

        }
    }]
);






