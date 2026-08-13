async function updateStudentNameHome() {
    const studentDetails = await getStudentDetails();
    while(!document.getElementById("home-user")) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    const homeUserSpan = document.getElementById("home-user");
    homeUserSpan.innerText = studentDetails.data.node.firstName;
}