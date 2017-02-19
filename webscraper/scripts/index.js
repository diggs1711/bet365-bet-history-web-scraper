(function() {
    var fileUpload = {
        input: null,

        init: function() {
            this.initElements();
            this.initListeners();
        },

        initElements: function() {
            this.input = document.querySelector(".file");
        },

        initListeners: function() {
            var self = this;

            this.input.addEventListener('change', self.getData.bind(this));
        },

        getData: function(e) {
            var fileReader = new FileReader();
            fileReader.onload = this.onReaderLoad.bind(this);
            fileReader.readAsText(e.target.files[0]);
        },

        onReaderLoad: function(e) {
            var obj = JSON.parse(e.target.result);
            this.extractData(obj.bets);
        },

        extractData: function(data) {
            var self = this;

            data.forEach(function(element, index) {
                pubSub.publish("calculateProfit", [element]);
                pubSub.publish("betLoaded", [element]);
            });

            pubSub.publish("dataLoadComplete", data);
        }

    };

    var betCalculator = {
        totalStaked: 0.0,
        totalReturned: 0.0,
        profit: 0.0,
        betStake: 0.0,
        betReturn: 0.0,
        bets: 0,

        calculateProfit: function(bet) {

            var stake = bet["bet_stake"];
            var betReturn = bet["bet_return"];

            this.bets += 1;
            this.betStake = parseFloat(stake);
            this.betReturn = parseFloat(betReturn);

            this.totalStaked += this.betStake;
            this.totalReturned += this.betReturn;

            this.profit += (-this.betStake + this.betReturn);
        }

    };

    var statsPanel = (function() {

        var panel = {
            mainEle: null,
            panelBody: null,

            init: function() {
                this.initElements();
            },

            initElements: function() {
                this.panelBody = document.querySelector('.js-stats');
            },

            createStatDisplayElement: function(name, value) {
                var div = document.createElement("div");
                div.className = "stat";

                var p = document.createElement("div");
                p.className = "w30";
                p.innerText = name;

                var val = document.createElement("div")
                val.className = "w70 boldFont";
                val.innerText = value;

                div.appendChild(p);
                div.appendChild(val);

                return div;
            },

            createPieChart: function() {
            	var self = this;
            	var series = self.createSeries();
            	console.log(series)

                Highcharts.chart('container', {
                    chart: {
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false,
                        type: 'pie'
                    },
                    title: {
                        enabled: false,
                        text: ""
                    },

                    tooltip: {
                        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: false,
                                format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                                style: {
                                    color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                                }
                            }
                        }
                    },
                    series: series
                });
            },

            createSeries: function() {
                var output = [];
                var result = {};

                result.name = 'Percentage';
                result.colorByPoint = true;
                result.data = [];

                var won = parseInt(betModel.getNumberOfBetsWon());
                var lost = parseInt(betModel.getNumberOfBetsLost());
                var pushed = parseInt(betModel.getNumberOfBetsPushed());
                var total = parseInt(betModel.getNumberOfBets());

                var w = {
                    name: 'Won',
                    y: (won/total),
                    color: '#5cb85c'
                };

                var l = {
                    name: 'Lost',
                    y: (lost/total),
                    color: '#d9534f'
                };

                var p = {
                	name: 'pushed',
                	y: (pushed/total),
                	color: '#f0ad4e'
                }

                result.data.push(w);
                result.data.push(l);
                result.data.push(p);

                output.push(result);

                return output;
            }
        };

        return panel;
    })();

    var betView = {
        betResult: null,
        betEvent: null,
        statsPanel: statsPanel,

        init: function() {
            this.initElements();
            this.statsPanel.init();
        },

        initElements: function() {
            this.betDate = document.querySelector('.bet-date');
            this.betEvent = document.querySelector('.bet-event');
        },

        createNewRow: function() {
            var tbody = document.querySelector('.bet-body');
            var newRow = tbody.insertRow(tbody.rows.length);
            newRow.className = "bet";

            return newRow;
        },

        addBetToDisplay: function(bet) {
            var row = this.createNewRow();

            for (var i = 0; i < 6; i++) {

            }

            var dateCell = row.insertCell(0);
            var eventCell = row.insertCell(1);
            var marketCell = row.insertCell(2);
            var stakeCell = row.insertCell(3);
            var returnCell = row.insertCell(4)
            var resultCell = row.insertCell(5);

            var dateText = document.createTextNode(bet.date);
            dateCell.className = "bet-date";

            var eventText = document.createTextNode(bet.event);
            eventCell.className = "bet-event";

            var marketText = document.createTextNode(bet.market);
            marketCell.className = "bet-type";

            var resultText = document.createTextNode(bet.result);
            if (bet.result === "Won") {

                var success = document.createElement("span")
                success.className = "label label-success";
                resultCell.className = "bet-result";
                success.appendChild(resultText);
                resultCell.appendChild(success);

                betModel.betsWon += 1;

            } else if (bet.result === "Lost") {

                var loss = document.createElement("span")
                loss.className = "label label-danger";
                resultCell.className = "bet-result";
                loss.appendChild(resultText);
                resultCell.appendChild(loss);

                betModel.betsLost += 1;

            } else {

                var push = document.createElement("span")
                push.className = "label label-warning";
                resultCell.className = "bet-result";
                push.appendChild(resultText);
                resultCell.appendChild(push);

                betModel.betsPushed += 1;
            }

            var stakeAmount = document.createTextNode(bet.stake)
            stakeCell.className = "bet-stake";

            var returnAmount = document.createTextNode(bet.return);
            returnCell.className = "bet-return";

            dateCell.appendChild(dateText);
            eventCell.appendChild(eventText);
            marketCell.appendChild(marketText);
            stakeCell.appendChild(stakeAmount);
            returnCell.appendChild(returnAmount);

        },

        createPanelView: function(d) {
            var numBets = this.statsPanel.createStatDisplayElement("# Bets", betModel.getNumberOfBets());
            this.statsPanel.panelBody.appendChild(numBets);

            var totalStaked = this.statsPanel.createStatDisplayElement("Staked(€)", betModel.getTotalAmountStaked());
            this.statsPanel.panelBody.appendChild(totalStaked);

            var totalReturned = this.statsPanel.createStatDisplayElement("Returned(€)", betModel.getTotalAmountReturned());
            this.statsPanel.panelBody.appendChild(totalReturned);

            var pieChart = document.createElement("div");
            pieChart.id = "container";
            this.statsPanel.panelBody.appendChild(pieChart);

            this.statsPanel.createPieChart();
        },

        createBetElement: function(r, e) {
            var betDiv = document.createElement('tr');
            var resultDiv = document.createElement('td');
            var eventDiv = document.createElement('td');

            resultDiv.innerText = r;
            eventDiv.innerText = e;

            betDiv.appendChild(resultDiv);
            betDiv.appendChild(eventDiv);

            return betDiv;
        }
    };

    var dataExtractor = {
        extract: function(data) {
            var output = {};

            var betDate = data['bet_date'];
            var event = data['bet_event'];
            var betResult = data['bet_result'];
            var betStake = data["bet_stake"];
            var betReturn = data["bet_return"];

            var event = event.split("(");
            var betEvent = event[0];
            var market = event[1].replace(")", "");

            output.date = betDate;
            output.event = betEvent;
            output.result = betResult;
            output.stake = betStake;
            output.return = betReturn;
            output.market = market;

            return output;
        }
    }

    var betController = {
        betView: betView,
        betModel: betModel,
        dataExtractor: dataExtractor,

        betLoaded: function(bet) {
            var result = dataExtractor.extract(bet);
            this.betView.addBetToDisplay(result);
            betModel.addBet(result);
        }
    };

    var betModel = {
        bets: [],
        totalAmountStaked: 0.0,
        totalAmountReturned: 0.0,
        betsWon: 0,
        betsLost: 0,
        betsPushed: 0,

        getNumberOfBets: function() {
            return this.bets.length;
        },

        addBet: function(bet) {
            this.bets.push(bet);
        },

        getNumberOfBetsWon: function() {
        	return this.betsWon;
        },

        getNumberOfBetsLost: function() {
        	return this.betsLost;
        },

        getNumberOfBetsPushed: function() {
        	return this.betsPushed;
        },

        getTotalAmountStaked: function() {
            var self = this;
            self.totalAmountStaked = 0.0;

            this.bets.forEach(function(bet) {
                self.totalAmountStaked += parseFloat(bet.stake);
            });

            return this.totalAmountStaked;
        },

        getTotalAmountReturned: function(bet) {
            var self = this;
            self.totalAmountReturned = 0.0;

            this.bets.forEach(function(bet) {
                self.totalAmountReturned += parseFloat(bet.return);
            });

            return this.totalAmountReturned;
        }
    }

    var pubSub = {
        cache: {
            "betLoaded": [],
            "calculateProfit": [],
            "dataLoadComplete": []
        },

        subscribe: function(e, fn, scope) {
            var sub = this.cache[e];
            if (!sub) return;

            sub.push({
                fn: fn,
                scope: scope
            });
        },

        publish: function(e, data) {
            var event = this.cache[e];
            if (!event) return;

            event.forEach(function(el, index) {
                el.fn.apply(el.scope, data || []);
            });
        }

    }

    fileUpload.init();
    betView.init();

    pubSub.subscribe("betLoaded", betController.betLoaded, betController);
    pubSub.subscribe("calculateProfit", betCalculator.calculateProfit, betCalculator);
    pubSub.subscribe("dataLoadComplete", betView.createPanelView, betView);

})();
