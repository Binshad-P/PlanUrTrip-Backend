import jwt from "jsonwebtoken";
function userToken(req,res,next){
    let authHeader=req.headers.authorization;
    if(authHeader==undefined){
        res.status(401).send({error:"no token provided"})
    }
    let token = authHeader.split(" ").pop();
    jwt.verify(token, "secret", function (err, decoded) {
        req.user = decoded.id;
        if (err) {
            res.status(500).send({ error: "authentication faild" });
          } else {
            next();
          }
    })
}
function adminToken(req,res,next){
  let authHeader=req.headers.authorization;
  if(authHeader==undefined){
      res.status(401).send({error:"no token provided"})
  }
  let token = authHeader.split(" ").pop();
  jwt.verify(token, "secret", function (err, decoded) {
     
      if (err) {
          res.status(500).send({ error: "authentication faild" });
        } else {
          next();
        }
  })
}

export {userToken,adminToken}