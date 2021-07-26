
All Ratings in db (DEV)  http://localhost:3000/api/work/rating/

All Rating for one Contractor http://localhost:3000/api/work/rating/(contractor_id)


Average rating for a contractor (fixed to one decimal point):
http://localhost:3000/api/work/rating/average/(contractor_id)


All reviws including  rating for a contractor :
http://localhost:3000/api/work/rating/reviews/(contractor_id)


Rate a contractor:POST http://localhost:3000/api/work/rating/

payload:
{"contractor_id":"string",
 "workorder_id":int,
  "client_id":"string",
  "rating":int,
  "review":"string"}

 Rules:

* Only one rating based on workorder id
* workoffer have to be chosen true
* Contractor must have post a offer on workorder  and the workorder must have ben created by the client who make the rating