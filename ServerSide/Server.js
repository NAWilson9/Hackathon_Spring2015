//Link dependencies
var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var cheerio = require('cheerio');
var Database = require('fileDB.js').Database;
var fs = require("fs");

//Create server
var server = express();

//Server Setup
server.use(bodyParser.json());
server.use(express.static('../ClientSide/'));

//Start server
server.listen(1337, function() {
    console.log('Hackathon server running on port ' + 1337);

	// database test, shows it works, delete if you want
	var test = Database('test');
	test.put("hello", "world", function(){

		test.get("hello", function(err, data){console.log(data)});

	});

});

//Takes in a url that points to an allmenu restaurant and a string stating the desired function
var parseMenu = function(url, funk){
    //Urls used to override imputed url
    //url = 'http://www.allmenus.com/ia/ames/270642-battles-bar-b-q/menu/';

    //Initialize overall menu object
    var menu;

    //Performs a request to get the html from the url
    request(url, function(error, response, html) {
        if (!error) {
            //Sets the parser scope to the html of the page
            var $ = cheerio.load(html);

            //Setup menu object
            menu = {
                "info": {
                },
                "categories":[
                ]
            };

            //Get restaurant info
            menu.info.name = $('#restaurant > h1').text();
            menu.info.phone = $('#phone_number').text();

            //Get restaurant address
            var address = "";
            address += $('#address > span:nth-child(1)').text();
            address += ", " + $('#address > span:nth-child(2)').text();
            address += " " + $('#address > span:nth-child(3)').text();
            address += " " + $('#address > span:nth-child(4)').text();
            menu.info.address = address;

            //Gets the categories
            $('.category').each(function(i,element) {
                var category = {
                    "name":"",
                    "description":"",
                    "items":[
                    ]
                };
                category.name = $(this).find('h3').text();
                category.description = $(this).find('p').text();

                //Gets the categories items
                $(this).find('li').each(function(i, element) {
                    var item = {
                        "name":"",
                        "price":""
                    };
                    item.name = $(this).find('.name').text();
                    item.price = $(this).find('.price').text();

                    //Adds the item to the category object
                    category.items.push(item);
                });

                //Add completed category with items to the menu object
                menu.categories.push(category);
            });
        } else {
            console.log("Unable to parse menu | " + url);
        }
    });

    if(funk == "cache"){
        fs.writeFile('./Menus/' + menu.info.name, JSON.stringify(menu), function (err) {
            if (err) return console.log(err);
            console.log('Hello World > helloworld.txt');
        });
    } else {
        return menu;
    }
};