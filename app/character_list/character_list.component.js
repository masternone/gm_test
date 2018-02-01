'use strict';

// Register `characterList` component, along with its associated controller and template
angular.module('characterList').component('characterList', {
    templateUrl: 'character_list/character_list.template.html',
    controller: function CharacterListController($http) {
        var self = this;
        self.characters = [];
        self.holdLoading = []
        /**
         * Species 1 is human
         */
        $http.get('https://swapi.co/api/species/1/').then(function (response) {
            getPerson($http, self, response.data.people);
        });
    }
});

var getPerson = function ($http, self, people) {
    var personUrl = people.splice(0, 1)[0];
    $http.get(personUrl).then(function (response) {
        self.holdLoading.push(response.data);
        getHomeWorld($http, self, response.data.homeworld, self.holdLoading.length - 1).then(function () {
            // This need to be in the get home world promise resolution to endure I have all the data
            if (people.length > 0) {
                getPerson($http, self, people);
            } else {
                self.holdLoading.sort(function (a, b) {
                    if (a.name > b.name) return 1;
                    if (a.name < b.name) return -1;
                    return 0;
                });
                self.characters = self.holdLoading;
            }
        });
    });
};

var getHomeWorld = function ($http, self, homeWorldUrl, key) {
    return $http.get(homeWorldUrl).then(function (response) {
        self.holdLoading[key].homeWorldData = response.data;
    });
};