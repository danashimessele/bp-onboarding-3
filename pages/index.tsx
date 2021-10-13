import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import firebase from "../firebase/clientApp";
import Auth from "../components/Auth"
import VoterList from '../components/VoterList';

import {useAuthState} from "react-firebase-hooks/auth";
import {useCollection} from "react-firebase-hooks/firestore"

export default function Home() {

  const db = firebase.firestore();

  const [user,loading,error] = useAuthState(firebase.auth());
  console.log("Loading:", loading, "|", "Current user:", user)

  const [votes, votesLoading, votesError] = useCollection(
    firebase.firestore().collection("votes"),
    {}
  );

  if (!votesLoading && votes) {
    votes.docs.map((doc) => console.log(doc.data()));
  }

  const addVoteDocument = async (vote: string) => {
    await db.collection("votes").doc(user.uid).set({
      vote,
    });
  };

  type VoteDocument = {
    vote: string;
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gridGap: 8,
        background:
          "linear-gradient(315deg, #2d3436 0%, #d3d3d3 74%)",
      }}
    >
      {loading && <h4>Loading...</h4>}
      {!user && <Auth />}
      {user && (
        <>
          <h1>Travel to the past or future?</h1>

          <div style={{ flexDirection: "row", display: "flex" }}>
            <button
              style={{ fontSize: 32, marginRight: 8 }}
              onClick={() => addVoteDocument("yes")}
            >
              PAST
            </button>
            <h3>
              {" "}
              {
                votes?.docs?.filter(
                  (doc) => (doc.data() as VoteDocument).vote === "yes"
                ).length
              }
            </h3>
          </div>
          <div style={{ flexDirection: "row", display: "flex" }}>
            <button
              style={{ fontSize: 32, marginRight: 8 }}
              onClick={() => addVoteDocument("no")}
            >
              FUTURE
            </button>
            <h3>
              Voters:{" "}
              {
                votes?.docs?.filter(
                  (doc) => (doc.data() as VoteDocument).vote === "no"
                ).length
              }
            </h3>
          </div>
          
          <div style={{ marginTop: "64px" }}>
            <h3>Voters:</h3>
            <div
              style={{
                maxHeight: "320px",
                overflowY: "auto",
                width: "240px",
              }}
            >
              {votes?.docs?.map((doc) => (
                <>
                  <VoterList id={doc.id} key={doc.id} vote={doc.data().vote} />
                </>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}