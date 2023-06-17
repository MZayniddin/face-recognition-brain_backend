const PAT = process.env.PAT;
const USER_ID = process.env.C_USER_ID;
const APP_ID = process.env.C_APP_ID;
const MODEL_ID = process.env.C_MODEL_ID;

const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");

const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();
metadata.set("authorization", "Key " + PAT);

const handleApiCall = (req, res) => {
  stub.PostModelOutputs(
    {
      user_app_id: {
        user_id: USER_ID,
        app_id: APP_ID,
      },
      model_id: MODEL_ID,
      inputs: [
        { data: { image: { url: req.body.input, allow_duplicate_url: true } } },
      ],
    },
    metadata,
    (err, response) => {
      if (err) {
        throw new Error(err);
      }

      if (response.status.code !== 10000) {
        throw new Error(
          "Post model outputs failed, status: " + response.status.description
        );
      }
      res.json(response);
    }
  );
};

const handleImage = (req, res, db) => {
  const { id } = req.body;
  if (!id) return res.status(400).json("ID required in body");
  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      res.json(entries[0].entries);
    })
    .catch((err) => {
      res.status(400).json("unable to get entries");
    });
};

module.exports = {
  handleImage,
  handleApiCall,
};
