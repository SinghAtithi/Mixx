const express = require('express');
const verify = require('../../middlewares/verify');
const Project = require('../../models/project');
const User = require('../../models/user');

const getAllProjectsRouter = express.Router();

getAllProjectsRouter.post('/getAllProjects', async (req, res) => {
      const { userId } = req.body;
      console.log(req.body);
      await User.findOne({ _id: userId })
            .then(async user => {
                  console.log(user);
                  console.log(userId);
                  let allUserProject = [];
                  let projectCount = 0;
                  if (user.savedProjects.length == 0) {
                        let noProjects = []
                        res.status(200).send(noProjects);
                  }
                  await user.savedProjects.forEach(async project => {
                        await Project.findOne({
                              _id: project
                        }).then(projectObj => {
                              console.log(projectObj);
                              if (projectObj) {

                                    let currentTime = new Date().getTime();
                                    let timeDifference = currentTime - projectObj.creationTime;
                                    let timeDifferenceInMinutes = Math.floor((timeDifference / 60000) / (60 * 24));
                                    let newProjectObj = {
                                          "_id": projectObj._id,
                                          "name": projectObj.name,
                                          "description": projectObj.description,
                                          "audioURL": projectObj.audioURL,
                                          "audioFormat": projectObj.audioFormat,
                                          "timeStampAndComment": projectObj.timeStampAndComment,
                                          "user": projectObj.user,
                                          "creationTime": projectObj.creationTime,
                                          "__v": projectObj.__v,
                                          "timeDiffDays": timeDifferenceInMinutes
                                    }
                                    allUserProject.push(newProjectObj);
                              }
                              projectCount++;
                              if (projectCount === user.savedProjects.length) {
                                    // console.log(timeDifferenceInMinutes);
                                    allUserProject.sort((b, a) => {
                                          return b.timeDiffDays - a.timeDiffDays;
                                    })
                                    res.status(200).json(allUserProject);
                              }
                        })
                  })
            }
            )
            .catch(err => {
                  console.log(err);
                  res.status(500).json({ error: err });
            }
            );
});


module.exports = getAllProjectsRouter;