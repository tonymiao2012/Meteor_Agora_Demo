/**
 * Created by stevenkehoe on 2/11/16.
 */
Template.home.onCreated(function() {
    client = {}, localStream = {};
    join = function() {
        document.getElementById("join").disabled = true;
        document.getElementById("video").disabled = true;
        // for dynamic key
        Meteor.call('generateDynamicKey',channel.value, function(error, result){
            if(error){
                console.log("dynamic key error "+ error);
            }
            client = AgoraRTC.createClient();
            //var dynamic_key = Session.get("dynamic_key");
            // for dynamic key
            /*client.init(dynamic_key, function () {*/
            //console.log(dynamic_key);
            client.init(result, function () {
                console.log("AgoraRTC client initialized");
                client.join(channel.value, undefined, function(uid) {
                    console.log("User " + uid + " join channel successfully");
                    localStream = AgoraRTC.createStream({streamID: uid, audio: true, video: document.getElementById("video").checked, screen: false});
                    if (document.getElementById("video").checked) {
                        localStream.setVideoProfile('720p_1');
                    }
                    localStream.init(function() {
                        console.log("getUserMedia successfully");
                        localStream.play('agora_local');

                        client.publish(localStream, function (err) {
                            console.log("Publish local stream error: " + err);
                        });

                        client.on('stream-published', function (evt) {
                            console.log("Publish local stream successfully");
                        });
                    }, function (err) {
                        console.log("getUserMedia failed", err);
                    });

                }, function(err) {
                    console.log("Join channel failed", err);
                });
            }, function (err) {
                console.log("AgoraRTC client init failed", err);
            });

            client.on('stream-added', function (evt) {
                var stream = evt.stream;
                console.log("New stream added: " + stream.getId());
                console.log("Subscribe ", stream);
                client.subscribe(stream, function (err) {
                    console.log("Subscribe stream failed", err);
                });
            });

            client.on('stream-subscribed', function (evt) {
                var stream = evt.stream;
                console.log("Subscribe remote stream successfully: " + stream.getId());
                if ($('div#video #agora_remote'+stream.getId()).length === 0) {
                    $('div#video').append('<div id="agora_remote'+stream.getId()+'" style="width:320px;height:240px"></div>');
                }
                stream.play('agora_remote' + stream.getId());
            });

            client.on('stream-removed', function (evt) {
                var stream = evt.stream;
                console.log("Remote stream is removed " + stream.getId());
            });

            client.on('peer-leave', function (evt) {
                console.log(evt.uid + " leaved from this channel");
            });
        });
        /*
         console.log("Try to get dynamic key");
         var use_https = ('https:' == document.location.protocol ? true : false);
         if (use_https) {
         var url_str = "https://ip:port/dynamic_key?channelName=" + channel.value;
         } else {
         var url_str = "http://ip:port/dynamic_key?channelName=" + channel.value;
         }
         $.ajax({
         url: url_str,
         error: function() {
         console.log("Failed to get dynamic key");
         },
         success: function(response) {
         console.log(response.key);
         dynamic_key = response.key;
        */
        //console.log("Init AgoraRTC client with _vendor key: " + key.value);

        // for dynamic key
        //}
        // });
    }

    leave = function() {
        document.getElementById("leave").disabled = true;
        client.leave(function () {
            console.log("Leavel channel successfully");
        }, function (err) {
            console.log("Leave channel failed");
        });
    }

    unpublish = function () {
        document.getElementById("unpublish").disabled = true;
        client.unpublish(localStream, function (err) {
            console.log("Unpublish local stream failed" + err);
        });
    }


})