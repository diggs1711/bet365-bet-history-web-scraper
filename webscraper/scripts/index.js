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

            console.log(betCalculator.profit);
            console.log(betCalculator.bets);
            console.log(betCalculator.totalStaked);
            console.log(betCalculator.totalReturned);
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

    var betView = {
        betResult: null,
        betEvent: null,

        init: function() {
            this.initElements();
        },

        initElements: function() {
            this.betDate = document.querySelector('.bet-date');
            this.betEvent = document.querySelector('.bet-event');
        },

        addValuesToElements: function(e) {
            var date = e['bet_date'];
            var event = e['bet_event'];
            var result = e['bet_result'];

            var tbody = document.querySelector('.bet-body');
            var newRow = tbody.insertRow(tbody.rows.length);
            newRow.className = "bet";

            var dateCell = newRow.insertCell(0);
            var eventCell = newRow.insertCell(1);
            var marketCell = newRow.insertCell(2);
            var stakeCell = newRow.insertCell(3);
            var returnCell = newRow.insertCell(4)
            var resultCell = newRow.insertCell(5);
            


            var dateText = document.createTextNode(date);
            dateCell.className = "bet-date";

            var e = event.split("(");
            var event = e[0];
            var betType = e[1].replace(")", "");

            var eventText = document.createTextNode(event);
            eventCell.className = "bet-event";

            var marketText = document.createTextNode(betType);
            marketCell.className = "bet-type";

            var resultText = document.createTextNode(result);
            if (result === "Won") {
                var success = document.createElement("span")
                success.className = "label label-success";
                resultCell.className = "bet-result";
                success.appendChild(resultText);
                resultCell.appendChild(success);
            } else if (result === "Lost"){
            	var loss = document.createElement("span")
                loss.className = "label label-danger";
                resultCell.className = "bet-result";
                loss.appendChild(resultText);
                resultCell.appendChild(loss);
            }
            else{
            	var push = document.createElement("span")
                push.className = "label label-warning";
                resultCell.className = "bet-result";
                push.appendChild(resultText);
                resultCell.appendChild(push);
            }

            var stakeAmount = document.createTextNode(betCalculator.betStake)
            stakeCell.className = "bet-stake";

            var returnAmount = document.createTextNode(betCalculator.betReturn);
            returnCell.className = "bet-return";

            dateCell.appendChild(dateText);
            eventCell.appendChild(eventText);
            marketCell.appendChild(marketText);
            stakeCell.appendChild(stakeAmount);
            returnCell.appendChild(returnAmount);
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

    var betController = {

    };

    var betModel = {
        bets: {}
    }

    var pubSub = {
        cache: {
            "betLoaded": [],
            "calculateProfit": []
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

    pubSub.subscribe("betLoaded", betView.addValuesToElements, betView);
    pubSub.subscribe("calculateProfit", betCalculator.calculateProfit, betCalculator);

})();
