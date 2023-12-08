const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const VotePosts = require("../../model/votes/votes");

const createPollVote = async (req, res) => {
    try {
        const {userId, vote, party } = req.body;
        const newVotePost = new VotePosts({
            userId, 
            vote, 
            party
          });
      
        const post = await newVotePost.save();
        if(post){
            res.status(200).json({message: "vote saved successfully", status:"200"});
        }else{
            res.json({message: "community post not added"});
        }
        
    } catch (error) {
        
    }
}

const getAllVotes = async (req, res) => {
    try {
        const totalVotes = await VotePosts.countDocuments();
        const aggregationResult = await VotePosts.aggregate([
            {
                $group: {
                    _id: '$party', // Group by the 'party' field
                    count: { $sum: 1 } // Count the number of documents for each party
                }
            },
            {
                $project: {
                    _id: 0,
                    party: '$_id',
                    count: 1,
                    percentage: {
                        $multiply: [
                            { $divide: ['$count', totalVotes] },
                            100
                        ]
                    }
                }
            },
            {
                $sort: { count: -1 } // Optionally, sort the result by count in descending order
            }
        ]);


        res.status(200).json({
            data: aggregationResult,
            nbHits: totalVotes,
            status:200
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


const getVote = async (req, res) => {
    try {
        const userId = req.params.id;
        
        const voteFound = await VotePosts.findOne({userId:userId});
        if(voteFound){
            res.status(200).json({data:voteFound,message: "Already voted", status:"200"});
        }else{
            res.status(400).json({message: "vote", status:"400"});
        }
        
    } catch (error) {
        
    }
}

module.exports = { createPollVote, getAllVotes, getVote };