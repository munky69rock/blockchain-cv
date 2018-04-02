pragma solidity ^0.4.19;

import "./CVExtender.sol";
import "zeppelin-solidity/contracts/ownership/Ownable.sol";

contract Munky69rockCV is CVExtender, Ownable {
    string url;
    string title;
    string description;

    struct Profile {
        string name;
        string email;
        string title;
        string location;
        string description;
    }

    struct Education {
        string name;
        string fieldOfStudy;
        string startedOn;
        string endedOn;
        string description;
    }

    struct Experience {
        string name;
        string role;
        string startedOn;
        string endedOn;
        string description;
    }

    struct Link {
        string linkType;
        string url;
    }

    Profile profile;
    Experience[] experiences;
    Education[] educations;
    Link[] links;
    string[] skills;
    uint lastUpdated;

    event UpdatedProfile();
    event UpdatedExperience();
    event UpdatedEducation();
    event UpdatedLink();
    event UpdatedSkill();
    event UpdatedMetadata();
    event ReceivedFunds(address indexed from, uint256 amount);

    function Munky69rockCV() public {
        url = "https://ethereum-cv.munky.work";
        title = "MUNKY69ROCK CV ON ETHEREUM";
        description = "CV smart contract using solidity";

        profile = Profile(
            "Masayuki Uehara",
            "munky69rock@gmail.com",
            "Engineer",
            "Tokyo, Japan",
            ""
        );

        educations.push(Education(
            "Kyoto University",
            "Economics",
            "2005-04-01",
            "2010-03-31",
            ""
        ));

        experiences.push(Experience(
            "DeNA Co., Ltd.",
            "Engineer (Web, iOS, Android, Machine Learning etc ...)",
            "2010-04-01",
            "2018-05-09",
            ""
        ));

        links.push(Link("facebook", "https://facebook.com/munky69rock"));
        links.push(Link("twitter", "https://twitter.com/munky69rock"));
        links.push(Link("linkedin", "https://linkedin.com/in/munky69rock"));
        links.push(Link("github", "https://github.com/munky69rock"));

        skills.push("Perl");
        skills.push("Python");
        skills.push("Ruby");
        skills.push("JavaScript");
        skills.push("Java");
        skills.push("Swift");
        skills.push("Solidity");

        lastUpdated = now;
    }

    function getProfile() external view returns(string, string, string, string, string) {
        return (profile.name, profile.email, profile.title, profile.location, profile.description);
    }


    function editProfile(string _name, string _email, string _title, string _location, string _description) external onlyOwner {
        profile.name = _name;
        profile.email = _email;
        profile.title = _title;
        profile.location = _location;
        profile.description = _description;

        emit UpdatedProfile();
        lastUpdated = now;
    }

    function addExperience(string _name, string _role, string _startedOn, string _endedOn, string _description) external onlyOwner returns(uint) {
        Experience memory experience = Experience(_name, _role, _startedOn, _endedOn, _description);
        uint _id = experiences.push(experience) - 1;
        emit UpdatedExperience();
        lastUpdated = now;
        return _id;
    }

    function editExperience(uint _id, string _name, string _role, string _startedOn, string _endedOn, string _description) external onlyOwner {
        Experience storage experience = experiences[_id];
        experience.name = _name;
        experience.role = _role;
        experience.startedOn = _startedOn;
        experience.endedOn = _endedOn;
        experience.description = _description;
        emit UpdatedExperience();
        lastUpdated = now;
    }

    function getExperienceCount() external view returns(uint) {
        return experiences.length;
    }

    function getExperience(uint _id) external view returns(string, string, string, string, string) {
        Experience memory experience = experiences[_id];
        return (experience.name, experience.role, experience.startedOn, experience.endedOn, experience.description);
    }

    function addEducation(string _name, string _fieldOfStudy, string _startedOn, string _endedOn, string _description) external onlyOwner returns(uint) {
        Education memory education = Education(_name, _fieldOfStudy, _startedOn, _endedOn, _description);
        uint _id = educations.push(education) - 1;
        emit UpdatedEducation();
        lastUpdated = now;
        return _id;
    }

    function getEducationCount() external view returns(uint) {
        return educations.length;
    }

    function getEducation(uint _id) external view returns(string, string, string, string, string) {
        Education memory education = educations[_id];
        return (education.name, education.fieldOfStudy, education.startedOn, education.endedOn, education.description);
    }

    function editEducation(uint _id, string _name, string _fieldOfStudy, string _startedOn, string _endedOn, string _description) external onlyOwner {
        Education storage education = educations[_id];
        education.name = _name;
        education.fieldOfStudy = _fieldOfStudy;
        education.startedOn = _startedOn;
        education.endedOn = _endedOn;
        education.description = _description;
        emit UpdatedEducation();
        lastUpdated = now;
    }

    function addSkill(string _skill) external onlyOwner returns(uint) {
        uint _id = skills.push(_skill) - 1;
        emit UpdatedSkill();
        lastUpdated = now;
        return _id;
    }

    function editSkill(uint _id, string _skill) external onlyOwner returns(uint) {
        skills[_id] = _skill;
        emit UpdatedSkill();
        lastUpdated = now;
    }

    function getSkillCount() external view returns(uint) {
        return skills.length;
    }

    function getSkill(uint _id) external view returns(string) {
        return skills[_id];
    }

    function addLink(string _linkType, string _url) external onlyOwner returns(uint) {
        uint _id = links.push(Link(_linkType, _url)) - 1;
        emit UpdatedLink();
        lastUpdated = now;
        return _id;
    }

    function editLink(uint _id, string _linkType, string _url) external onlyOwner returns(uint) {
        Link storage link = links[_id];
        link.linkType = _linkType;
        link.url = _url;
        emit UpdatedLink();
        lastUpdated = now;
    }

    function getLinkCount() external view returns(uint) {
        return links.length;
    }

    function getLink(uint _id) external view returns(string, string) {
        Link memory link = links[_id];
        return (link.linkType, link.url);
    }

    function getLastUpdated() external view returns(uint) {
        return lastUpdated;
    }

    function isOwner() external view returns(bool) {
        return msg.sender == owner;
    }

    function setAddress(string _url) external onlyOwner {
        url = _url;
        emit UpdatedMetadata();
        lastUpdated = now;
    }

    function setTitle(string _title) external onlyOwner {
        title = _title;
        emit UpdatedMetadata();
        lastUpdated = now;
    }

    function setDescription(string _description) external onlyOwner {
        description = _description;
        emit UpdatedMetadata();
        lastUpdated = now;
    }

    function getAddress() public view returns(string) {
        return url;
    }

    function getDescription() public view returns(string) {
        return description;
    }

    function getTitle() public view returns(string) {
        return title;
    }

    function getAuthor() public view returns(string, string) {
        return (profile.name, profile.email);
    }

    function transfer(address _to, uint _amount) external onlyOwner {
        _to.transfer(_amount);
    }

    function() payable public {
        require(msg.value > 0);
        emit ReceivedFunds(msg.sender, msg.value);
    }
}
