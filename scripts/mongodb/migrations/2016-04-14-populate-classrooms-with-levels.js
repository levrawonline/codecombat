load('bower_components/lodash/dist/lodash.js');

var courses = db.courses.find({}).sort({_id:1}).toArray();
var ids = _.pluck(courses, 'campaignID');
var campaigns = db.campaigns.find({_id: {$in: ids}}).toArray();
var campaignMap = {};
for (var campaignIndex in campaigns) {
  var campaign = campaigns[campaignIndex];
  campaignMap[campaign._id.str] = campaign;
}
var coursesData = [];

for (var courseIndex in courses) {
  var course = courses[courseIndex];
  var courseData = { _id: course._id, levels: [] };
  var campaign = campaignMap[course.campaignID.str];
  
  _.forOwn(campaign.levels, function(level) {
    levelData = { original: ObjectId(level.original) };
    _.extend(levelData, _.pick(level, 'type', 'slug'));
    courseData.levels.push(levelData);
  });
  coursesData.push(courseData);
}
  
print('constructed', JSON.stringify(coursesData));

db.classrooms.update(
  {}, // Set all
  //{courses: {$exists: false}}, // Set all w/out values
  {$set: {courses: coursesData}},
  {multi: true}
);