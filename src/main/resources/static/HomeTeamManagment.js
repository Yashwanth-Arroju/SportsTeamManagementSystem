const URL = "https://fir-1c7de-default-rtdb.firebaseio.com/sportsTeamManagment";
var currentUserId = localStorage.getItem('userId');
var teamDetails = localStorage.getItem("teamDetails");
var app = angular.module('myApp', []);
app.controller('myCtrl', function ($scope) {
    $scope.isPlayerLogin = localStorage.getItem('isPlayerLogin') == 'true';
    $scope.onload = function () {
        $scope.teamDetails = JSON.parse(teamDetails);
        $scope.viewEventData = [];
        $scope.gameData = {};
        $scope.participateEventData = {};
        $scope.playerDetailsData = {};
        $scope.getParticipateTableData();
        $("#viewDetailsDivId").show();
        $("#addEventDivId").hide();
        $("#addPlayerDivId").hide();
        $("#participateEventsDivId").hide();
        $scope.viewParticipateData = [];
        let maxDate = new Date().toISOString().split('T')[0];
        $("#eventDateId").attr('min', maxDate);
    }
    $scope.logout = function () {
        window.location.href = "loginTeam.html";
    }
    $scope.getGameTableData = function () {
        $scope.viewEventData = [];
        $.ajax({
            type: 'get',
            contentType: "application/json",
            dataType: 'json',
            cache: false,
            url: URL + "/addEvent/" + currentUserId + ".json",
            success: function (response) {
                for (let i in response) {
                    let eventData = response[i];
                    eventData["eventId"] = i;
                    $scope.viewEventData.push(eventData);
                }
                $scope.$apply();

            }, error: function (error) {
                alert("Please Check Data");
            }
        });
    }
    $scope.addGameData = function () {
        if ($scope.gameData.hasOwnProperty('eventDate')) {
            $scope.gameData['eventDate'] = $("#eventDateId").val();
        }
        $.ajax({
            type: 'post',
            contentType: "application/json",
            dataType: 'json',
            cache: false,
            url: URL + "/addEvent/" + currentUserId + ".json",
            data: JSON.stringify($scope.gameData),
            success: function (response) {
                $scope.getGameTableData();
                alert("Data Submitted Successfully !!");
            }, error: function (error) {
                alert("Please Check Data");
            }
        });
    }

    $scope.getParticipateTableData = function () {
        $scope.viewParticipateData = [];
        $scope.ParticipateDetails = [];
        $.ajax({
            type: 'get',
            contentType: "application/json",
            dataType: 'json',
            cache: false,
            url: URL + "/addParticipate/" + currentUserId + ".json",
            success: function (response) {
                for (let i in response) {
                    let eventData = response[i];
                    eventData["participateId"] = i;
                    $scope.viewParticipateData.unshift(eventData);
                }
                let gameData = [];
                $.ajax({
                    type: 'get',
                    contentType: "application/json",
                    dataType: 'json',
                    cache: false,
                    url: URL + "/addEvent/" + currentUserId + ".json",
                    success: function (response) {
                        for (let i in response) {
                            let eventData = response[i];
                            eventData["eventId"] = i;
                            gameData.push(eventData);
                        }
                        gameData.forEach(function (obj) {
                            let dataObj = {}
                            dataObj["playersList"] = [];
                            dataObj["gameDetails"] = { ...obj };

                            dataObj["playersList"] = $scope.viewParticipateData.filter(function (elm) {
                                return elm.game.eventId === obj.eventId
                            })
                            $scope.ParticipateDetails.push(dataObj);
                        })
                        $scope.$apply();
                    }, error: function (error) {
                        alert("Please Check Data");
                    }
                });

            }, error: function (error) {
                alert("Please Check Data");
            }
        });
    }
    $scope.addParticipate = function () {
        delete $scope.participateEventData.player["$$hashKey"]
        delete $scope.participateEventData.game["$$hashKey"]
        $.ajax({
            type: 'post',
            contentType: "application/json",
            dataType: 'json',
            cache: false,
            url: URL + "/addParticipate/" + currentUserId + ".json",
            data: JSON.stringify($scope.participateEventData),
            success: function (response) {
                $scope.participateEventData = {};
                alert("Data Submitted Successfully !!");
            }, error: function (error) {
                alert("Please Check Data");
            }
        });
    }

    $scope.addPlayerData = function () {
        $scope.playerDetailsData["teamDetails"] = { ...$scope.teamDetails };
        delete $scope.playerDetailsData["teamDetails"].$$hashKey;
        $.ajax({
            type: 'post',
            contentType: "application/json",
            dataType: 'json',
            cache: false,
            url: URL + "/addPlayer/" + currentUserId + ".json",
            data: JSON.stringify($scope.playerDetailsData),
            success: function (response) {
                $scope.playerDetailsData = {};
                $scope.getPlayerData();
                alert("Data Submitted Successfully !!");
            }, error: function (error) {
                alert("Please Check Data");
            }
        });
    }
    $scope.getPlayerData = function () {
        $scope.playerDataData = [];
        $.ajax({
            type: 'get',
            contentType: "application/json",
            dataType: 'json',
            cache: false,
            url: URL + "/addPlayer/" + currentUserId + ".json",
            success: function (response) {
                for (let i in response) {
                    let eventData = response[i];
                    eventData["playerId"] = i;
                    $scope.playerDataData.push(eventData);
                }
                $scope.$apply();

            }, error: function (error) {
                alert("Please Check Data");
            }
        });
    }
    $scope.switchMenu = function (type, id) {
        $(".menuCls").removeClass("active");
        $('#' + id).addClass("active");
        $scope.isIteaisParticipateTabmTab = false;
        $("#addEventDivId").hide();
        $("#viewDetailsDivId").hide();
        $("#addPlayerDivId").hide();
        $("#participateEventsDivId").hide();

        if (type == "VIEW-DETAILS") {
            $("#viewDetailsDivId").show();
            $scope.getParticipateTableData();
        } else if (type == "ADD-EVENT") {
            $scope.getGameTableData();
            $scope.gameData = {};
            $("#addEventDivId").show();
        } if (type == "ADD-PLAYER") {
            $scope.playerData = {};
            $("#addPlayerDivId").show();
            $scope.getPlayerData();
        } else if (type == "PARTICIPATE_EVENT") {
            $scope.getPlayerData();
            $scope.participateEventData = {};
            $("#participateEventsDivId").show();
            $scope.getGameTableData();
        }
    }
});
