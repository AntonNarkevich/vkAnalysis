/**
 * Created by Neurosis on 11.02.14.
 */
/*global jQuery, async, _*/
(function core(global, $, async, _) {
	"use strict";

	var URL = 'http://api.vk.com/method/',
		USER_ID = 20528987,
		TOP_SIZE = 15;

	var network = {};

	var counter = 0;

	function getFriends(id, callback) {
		$.ajax({
			url: URL + 'friends.get?uid=' + id,
			crossDomain: true,
			dataType: 'jsonp'
		})
			.done(function (data) {
				console.log('Vk response for ' + id
					+ ' is');
				console.log(data);

				callback(data.response);
			})
			.fail(function (error) {
				console.log('Vk ajax request failed ' + error);

				window.alert(error);
			});
	}

	function getRegisterUserTask(id) {
		return function () {
			getFriends(id, function (friends) {
				network[id] = friends;

				console.log('Registered in network ' + id);
				console.log(counter += 1);
			});
		};
	}

	function outputObject(obj) {
		console.log(obj);

		var $body = $('body');
		$body.append(JSON.stringify(obj));

		console.log('Result has been outputted.');
	}

	function buildNetwork() {
		getFriends(USER_ID, function (friends) {
			network[USER_ID] = friends;

			var tasks = _.map(friends, getRegisterUserTask);

			async.parallel(tasks, function () {
				console.log('Finishing callback for all register tasks has been invoked.')
				window.alert('The network has been built');
				outputObject(network);
			});
		});
	}

	function findLeaders(netArray, masterId) {
		var leaders = _.chain([[1,1,1],[1,1,12],[3,3],[5,5,5,5, 1]])
			.flatten()
			.groupBy(_.identity)
			.map(function (occuernces, id) {
				return { id: id, popularity: occuernces.length };
			})
			.sortBy(function (popularityInfo) {
				return -popularityInfo.popularity;
			})
			.take(TOP_SIZE);

		return leaders;
	}

	console.log('Starting building network');
	buildNetwork();

	(function doExport() {
		console.log('Export has been done');

		global.network = network;
		globel.findLeaders = findLeaders;

	}());

}(this, jQuery, async, _));