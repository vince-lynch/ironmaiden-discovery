
// Below is a Node.js function that a developer has written. It is an express middleware that processes users invitations to use private shops.
 
// ● req ​and res ​are the express request and response objects
 
// ● superagent ​is a module that makes http requests and is on npm
 
// ● "User​" and "Shop​" are mongoose models
 
// Step 1
 
// Analyse the function below and provide answers to the following questions:
 
// ● What do you think is wrong with the code, if anything?
 
// If the invitation already exists, yes it updates the invitation but it does not send a response to the user after it has updated. (it sends it before).
 
// ● Can you see any potential problems that could lead to exceptions
 
// Yes, even if there is a response different to 201 or 200 from https://url.to.auth.system.com/invitation then the user still gets the success response from line 57 res.json(invitationResponse);
 
// ● How would you refactor this code to:
 
// ○ Make it easier to read
 
// The code already is pretty easy to read.
 
// ○ Increase code reusability
 
// Hmm, you could break UserModel.findOneAndUpdate into it’s own function with the Shop.findById and the pushing of the user_id into the users array on the shop document, but really I think that would be unnecessary 
 
// ○ Improve the stability of the system
 
// Maybe if there is no req.param.shopId or if there is no res.body {} then there would be problems, so it should check that it has that before executing the code.
 
// ○ Improve the testability of the code
 
// ● How might you use the latest JavaScript features to refactor the code?
 
 
"use strict";
//Task 2 Code Snippet

exports.inviteUser = (req, res)=> {

	if(req.params.hasOwnProperty('shopId') && invitationBody.hasOwnProperty('email')){


		var invitationBody = req.body;

		var shopId = req.params.shopId;

		var authUrl = "https://url.to.auth.system.com/invitation";

		superagent

		.post(authUrl)

		.send(invitationBody)

		.end((err, invitationResponse)=> {

			if (invitationResponse.status === 201) {

				UserModel.findOneAndUpdate({authId: invitationResponse.body.authId}, 
					{authId: invitationResponse.body.authId,email: invitationBody.email},
					{upsert: true, new: true}).exec()
	    		.then((err, createdUser) => {

					Shop.findById(shopId).exec()
					.then((err, shop)=> {

						if (err || !shop) {
							return res.status(500).send(err || { message: 'No shop found' });
						}

						if (!shop.invitations.includes(invitationResponse.body.invitationId)) { // updates to use es6 includes instead of indexOf

							shop.invitations.push(invitationResponse.body.invitationId);

						}

						if (!shop.users.includes(createdUser._id)) { // updates to use es6 includes instead of indexOf

							shop.users.push(createdUser);

						}

						shop.save((err,saved)=>{
							res.json(invitationResponse);
						});

					});

				});

			} else if (invitationResponse.status === 200) {

				res.status(400).json({error: true, message: 'User already invited to this shop'});
				return;
			} else {
				res.status(400).json({error: true, message: 'Something went wrong - wrong response from https://url.to.auth.system.com/invitation'});
			}

		});

	} else { // end of check req.body.properties

		res.status(400).json({error: true, message: 'Inaccurate post request, needed req.body.email and params shopId'});
		return;

	} 


};