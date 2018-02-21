
app.controller('authController', function($scope,$http,$location) {

    $scope.user  = {username:'',password:''};
    $scope.alert = '';

    $scope.login = function(user){
        $http.post('/auth/login', user).
            success(function(data) {
                $scope.loggeduser = data;
                $location.path('/home');
            }).
            error(function() {
                $scope.alert = 'Login failed'
            });

    };

    $scope.signup = function(user){
        $http.post('/auth/signup', user).
            success(function(data) {
                $scope.alert = data.alert;
             }).
            error(function() {
                $scope.alert = 'Registration failed'
            });

    };






});

app.factory('MIService',function(){

    var MIS = [  "Apples","Akudjura","Almond","Apricot","Jam","Avocado","Beef","Bacon","Baking Powder","Banana","Bay Leaf","Bean","Beef","Beef (Mince)","Beer","Biscuits","Bocconcini","Bread","Broccoli","Butter","Butter","Cabbage","Cacao Powder","Capsicum","Cardamom","Carrot","Cheese","Cherries","Chicken","Chilli","Chocolate","Chutney","Cinnamon","Cloves","Cocoa Powder","Coriander","Corn","Cream","Cucumber","Cumin Seeds","Curry","Duck","Egg","Fig","Fish","Garam Masala","Garlicc","Ghee","Ginger","Grapes","Honey","Ice Cream","Jam","Kiwi","Lamb","Lemon","Mango","Mayonnaise","Meat","Milk","Mint","Mushrooms","Mustard","Noodles","Oats","Oil","Onion","Orange","Paneer","Paprika","Pasta","Pastry","Peanuts","Pepper","Pesto","Pineapple","Pizza","Pork","Potato","Pumpkin","Rice","Rum","Saffron","Salami","Salmon","Salt","Spaghetti","Spinach","Sugar","Sugo","Sweet Chil Sauce","Tacos","Tamarind","Tofu","Tomato","Tomatoes","Vanilla","Vinegar","Wholemeal","Wine","Yogurt" ];

    return MIS;

});


app.controller('recipeCtrl',['$scope','$http','MIService','$filter','$location', function ($scope,$http,MIService,$filter,$location) {

        var lastIngredientId = 0;
        // Initialize the scope defaults.
        $scope.recipes = [];
        $scope.data = [];
        $scope.kitchen = [];
        $scope.new_ing = undefined;
        $scope.ingnames= MIService;

        $scope.clearSearch = function () {
            $scope.searchAll = "";
        };
        $scope.remove_all_ingredients = function() {

            if (!confirm('Are you sure you want to remove all your ingreidents?')) {
                return false;
            }

            $scope.reset();

        };
        $scope.logout = function(){
            $http.get('/auth/logout')
                .success(function() {
                    $scope.loggeduser = {};
                    $location.path('/signin');

                })
                .error(function() {
                    $scope.alert = 'Logout failed'
                });
        };
        $scope.reset = function() {
            $scope.kitchen = [];
            $scope.focused = '';
            $scope.recipes = [];

        };

        $scope.userinfo = function() {
            $http.get('/auth/currentuser').
                success(function (data) {
                    $scope.loggeduser = data;
                }).
                error(function () {
                    $scope.alert = 'Login failed'
                });
        };
        $scope.searchByRecipeName = function(){


            $http.get('http://localhost:6060/searchByRecipeName/'+$scope.query +'/500').
                success(function(data) {
                    $scope.recipes = data;

                }).error(function(response){
                    console.log("error");
                });
            $scope.query='';

        };
        $scope.searchByIngredients = function(){

            if ($filter('filter')($scope.kitchen, {
                'name': $scope.new_ing
            }, true).length) {
                alert('That ingredient is already in your kitchen');
                $scope.new_ing='';
                return false;
            }

            $scope.kitchen.push({id:lastIngredientId++,name:$scope.new_ing});


            if($scope.kitchen.isNull){
                console.log('add ingredientssss');
            }


            else {
                var ing = $scope.kitchen.map(function (v) {
                    return v.name;
                }).join(",");

            }

            $http.get('http://localhost:6060/searchByIngredients/'+ing+'/500').
                success(function(data) {
                    $scope.recipes = data;

                }).error(function(response){
                    console.log("error");
                });
            $scope.new_ing='';

        };

        $scope.ing_sort = function(recipe) {


        };
        var pagesShown = 1;
        var pageSize = 15;

        $scope.paginationLimit = function(data) {
            return pageSize * pagesShown;
        };
        $scope.hasMoreItemsToShow = function() {
            return pagesShown < ($scope.recipes.length / pageSize);
        };
        $scope.showMoreItems = function() {
            pagesShown = pagesShown + 1;
        };



        $scope.removeIngredient = function(id){
            $scope.kitchen.splice(id,1);


            $scope.kitchen = $scope.kitchen.filter(function(e){return e.id != id;});

            var ing = $scope.kitchen.map(function (v) {
                return v.name;
            }).join(",");


            $http.get('http://localhost:6060/searchByIngredients/'+ing+'/500').
                success(function(data) {
                    $scope.recipes = data;
                }).error(function(response){
                    console.log("error");
                });

            $scope.recipes= [];

        };

    }]

);


