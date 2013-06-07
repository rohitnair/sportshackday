This is a quick hack (done for Sports Hack Day '13 in Seattle) that implements 
a real time voting app using node.js, socket.io and Mongo DB (via mongoose).
Voting is done by making an HTTP POST request to /api/vote with a "Yes" or a "No" (in the original demo, 
we had wired this end point with Twilio, so a person could vote via SMS) 

There's also a terrible rendering of this using highcharts.js (see playbyplay.html) The votes were pushed realtime
to the browser using socket.io and rendered using a chart. 

The whole thing mostly works, but there are definitely some issues, the big one being the mongo tailable cursor 
getting reset each time the server was restarted (since I was pushing each vote to the browser and not the aggregate
count, this sometimes resulted in bogus vote counts) 

The important files to look at are probably the vote model where I define the capped collection (models/vote.js ),
the controller (controllers/vote.js) where I define the logic to receive and update votes,
the main app.js file, which is where I define the server-side socket.io code and stream the capped collection,
and finally public/playbyplay.html which has the client side code. 

I also blogged about a few other points [here](http://rohitnair.info/real-time-voting-app-with-node-js-socket-io-and-mongoose/) 

