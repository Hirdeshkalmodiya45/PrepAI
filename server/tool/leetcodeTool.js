const leetcodeprogress=require("../models/LeetcodeProgress");

async function getLeetcodeProfile(userid){
    const profile=leetcodeprogress.findOne(
        {
           user: userid,
        }
    );
    return profile;

}
module.exports = {
    getLeetcodeProfile,
};