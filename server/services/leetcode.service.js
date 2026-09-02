

export const fetchLeetcodeData = async (username) => {
const query = `
query getUserProfile($username: String!) {
  matchedUser(username: $username) {
    username
    profile {
      ranking
    }
    submitStats {
      acSubmissionNum {
        difficulty
        count
      }
    }
  }
}
`;

const variables = {
    username
}
const response = await fetch("https://leetcode.com/graphql", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        query,
        variables
    })
});
const data = await response.json();
return data;
}