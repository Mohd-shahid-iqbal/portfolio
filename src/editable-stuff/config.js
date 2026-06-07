// Navigation Bar SECTION
const navBar = {
  show: true,
};

// Main Body SECTION
const mainBody = {
  gradientColors: "#4484ce, #1ad7c0, #ff9b11, #9b59b6, #ff7f7f, #ecf0f1",
  firstName: "Mohd",
  middleName: "Shahid",
  lastName: "Iqbal",
  message: " Passionate about changing the world with technology. ",
  icons: [
    {
      image: "fa-github",
      url: "https://github.com/Mohd-shahid-iqbal",
    },
    {
      image: "fa-facebook",
      url: "https://www.facebook.com/profile.php?id=100002142394297",
    },
    {
      image: "fa-instagram",
      url: "https://www.instagram.com/shahid27945/",
    },
    {
      image: "fa-linkedin",
      url: "https://www.linkedin.com/in/mohd-shahid-iqbal-2b690713b/",
    },
  ],
};

// ABOUT SECTION
// If you want the About Section to show a profile picture you can fill the profilePictureLink either with:
//a) your Instagram username
//      i.e:profilePictureLink:"johnDoe123",
//b) a link to an hosted image
//      i.e:profilePictureLink:"www.picturesonline.com/johnDoeFancyAvatar.jpg",
//c) image in "editable-stuff" directory and use require("") to import here,
//      i.e: profilePictureLink: require("../editable-stuff/shahid.png"),
//d) If you do not want any picture to be displayed, just leave it empty :)
//      i.e: profilePictureLink: "",
// For Resume either provide link to your resume or import from "editable-stuff" directory
//     i.e resume: require("../editable-stuff/resume.pdf"),
//         resume: "https://docs.google.com/document/d/13_PWdhThMr6roxb-UFiJj4YAFOj8e_bv3Vx9UHQdyBQ/edit?usp=sharing",

const about = {
  show: true,
  heading: "About Me",
  imageLink: require("../editable-stuff/shahid.png"),
  imageSize: 375,
  message:
    "My name is Mohd Shahid Iqbal. I’m a post-graduate of 2020 from Jamia hamdard University at New Delhi with a degree in Masters of Computer Application . I'm most passionate about giving back to the community, and my goal is to pursue this passion within the field of software engineering. In my free time I like working on open source projects.",
  resume:
    "https://docs.google.com/document/d/1gDdMSvyTkcT8WWzZ3-gbiTpt9ROAjjQ0/edit?usp=sharing&ouid=115531536691684412006&rtpof=true&sd=true",
};

// PROJECTS SECTION
// Setting up project lenght will automatically fetch your that number of recently updated projects, or you can set this field 0 to show none.
//      i.e: reposLength: 0,
// If you want to display specfic projects, add the repository names,
//      i.e ["repository-1", "repo-2"]
const repos = {
  show: true,
  heading: "Recent Projects",
  gitHubUsername: "Mohd-shahid-iqbal", //i.e."johnDoe12Gh"
  reposLength: 4,
  specificRepos: [],
};

// Leadership SECTION
const leadership = {
  show: true,
  heading: "Leadership",
  message:
    "As a React developer with leadership experience, I bring technical expertise, project management skills, and strong communication abilities to the table. I have a proven track record of building large-scale applications, optimizing code for performance, and implementing best practices. Additionally, I have experience leading teams and projects, creating and maintaining project plans, managing timelines and budgets, and ensuring timely delivery of high-quality work. I excel at communicating effectively with team members, stakeholders, and clients, both verbally and in writing, and am a skilled listener who can provide clear and constructive feedback. I am also passionate about mentoring and training other developers to help them develop their skills and achieve their goals. With my ability to solve complex technical problems and think creatively, I am always up-to-date with the latest developments in React and related technologies, and am able to innovate and inspire a positive, collaborative work environment.",
  images: [
    {
      img: require("../editable-stuff/home.png"),
      label: "First slide label",
      paragraph:
        "Home page of Task Management system where a user can manage all their tasks",
    },
    {
      img: require("../editable-stuff/add.png"),
      label: "Second slide label",
      paragraph: "User can add his task from this page",
    },
    {
      img: require("../editable-stuff/edit.png"),
      label: "Second slide label",
      paragraph:
        "If user Write somethings wrong then here he can edit the task ",
    },
    {
      img: require("../editable-stuff/1.png"),
      label: "Dashboards",
      paragraph: "Dashboard with charts ",
    },
    {
      img: require("../editable-stuff/2.png"),
      label: "Users Module",
      paragraph: "Users can be managed from here ",
    },
    {
      img: require("../editable-stuff/3.png"),
      label: "Products",
      paragraph: "All the Products Are listed here ",
    },
    {
      img: require("../editable-stuff/4.png"),
      label: "Add Zone",
      paragraph: "A Zone can be Added from here ",
    },
    {
      img: require("../editable-stuff/5.png"),
      label: "Transactions",
      paragraph: "All the Transactions Are listed here",
    },
    {
      img: require("../editable-stuff/6.png"),
      label: "Vending Machine List",
      paragraph: "All the Vending machines are listed here",
    },
    {
      img: require("../editable-stuff/7.png"),
      label: "Overview",
      paragraph: "Vending Machine Overview ",
    },
    {
      img: require("../editable-stuff/8.png"),
      label: "Refill Vending Machine",
      paragraph: "User can refill machine from here ",
    },
  ],
  imageSize: {
    width: "615",
    height: "450",
  },
};

// SKILLS SECTION
const skills = {
  show: true,
  heading: "Skills",
  hardSkills: [
    { name: "React", value: 90 },
    { name: "JavaScript", value: 90 },
    { name: "Data Structures", value: 65 },
    { name: "HTML/CSS", value: 55 },
    { name: "TypeScript", value: 80 },
    { name: "SQL", value: 75 },
  ],
  softSkills: [
    { name: "Goal-Oriented", value: 80 },
    { name: "Collaboration", value: 90 },
    { name: "Positivity", value: 75 },
    { name: "Adaptability", value: 85 },
    { name: "Problem Solving", value: 75 },
    { name: "Empathy", value: 90 },
    { name: "Organization", value: 70 },
    { name: "Creativity", value: 90 },
  ],
};

// GET IN TOUCH SECTION
const getInTouch = {
  show: true,
  heading: "Get In Touch",
  message:
    "I'm currently looking for full-time React Developer/Frontend Developer opportunities! If you know of any positions available, if you have any questions, or if you just want to say hi, please feel free to email me at",
  email: "khansaif59@gmail.com",
};

const experiences = {
  show: true,
  heading: "Experiences",
  data: [
    {
      role: "React Developer",
      companylogo: require("../assets/img/simpana.png"),
      date: "Aug 2020 – May 2022",
    },
    {
      role: "Senior Software Engineer", // Here Add Company Name
      companylogo: require("../assets/img/vendify.png"),
      date: "May 2022 – March 2023",
    },
    {
      role: "React Developer",
      companylogo: require("../assets/img/paceTrader.png"),
      date: "March 2023 – Present",
    },
  ],
};

export {
  navBar,
  mainBody,
  about,
  repos,
  skills,
  leadership,
  getInTouch,
  experiences,
};
