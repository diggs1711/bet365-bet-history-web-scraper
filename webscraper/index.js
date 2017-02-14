(function() {
	var fileUpload = {
		input: null,

		init: function() {
			this.initElements();
			this.initListeners();
		},

		initElements: function(){
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

			data.forEach( function(element, index) {
				pubSub.publish("betLoaded", [element]);
				pubSub.publish("calculateProfit", [element]);
			});

			console.log(betCalculator.profit);
			console.log(betCalculator.bets);
		}

	};

	var betCalculator = {
		profit: 0.0,
		stake: 0.0,
		betReturn: 0.0,
		bets: 0,

		calculateProfit: function(bet) {

			var stake = bet["bet_stake"];
			var betReturn = bet["bet_return"];

			this.bets += 1;
			this.stake = parseFloat(stake);
			this.betReturn = parseFloat(betReturn);

			this.profit += (-this.stake + this.betReturn);
		}

	};

	var betView = {
		betResult : null,
		betEvent: null,

		init: function() {
			this.initElements();
		},

		initElements: function() {
			this.betResult = document.querySelector('.bet-date');
			this.betEvent = document.querySelector('.bet-event');
		},

		addValuesToElements: function(e) {
			var d = e['bet_date'];
			var ev = e['bet_event'];
			var result = e['bet_result'];

			var tbdoy = document.querySelector('.bet-body');
			var newRow = tbdoy.insertRow(tbdoy.rows.length);
			newRow.className = "bet";

			var dCell = newRow.insertCell(0);
			var eCell = newRow.insertCell(1);
			var rCell = newRow.insertCell(2);
			var mCell = newRow.insertCell(3);

			var dText = document.createTextNode(d);
			dCell.className = "bet-result";

			var s = ev.split("(");
			var ev = s[0];
			var betType = s[1].replace(")", "");

			var eText = document.createTextNode(ev);
			eCell.className = "bet-event";

			var mText = document.createTextNode(betType);
			mCell.className = "bet-type";

			var rText =document.createTextNode(result);
			if(result === "Won")
				rCell.className = "bet-result won";
			else if(result === "Lost" )
				rCell.className = "bet-result lost";
			else
				rCell.className = "bet-result void"

			dCell.appendChild(dText);
			eCell.appendChild(eText);
			rCell.appendChild(rText);
			mCell.appendChild(mText);
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
			if(!sub) return;

			sub.push({
				fn: fn,
				scope: scope
			});
		},

		publish: function(e, data) {
			var event = this.cache[e];
			if(!event) return;

			event.forEach( function(el, index) {
				el.fn.apply(el.scope, data || []);
			});
 		}

	}

	fileUpload.init();
	betView.init();

	pubSub.subscribe("betLoaded", betView.addValuesToElements, betView);
	pubSub.subscribe("calculateProfit", betCalculator.calculateProfit, betCalculator);

})();