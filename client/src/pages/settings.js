import React from "react"
import Layout from "../components/Layout.js"
import { useState, useEffect, useRef } from "react"
import axios from "axios"
import { useSelector, useDispatch } from "react-redux"
import { getToken } from "../actions/getToken"
import { Link, navigate } from "gatsby"
import styled from "styled-components"
import { getUserData } from "../actions/getUserData"

const ValidationMsg = styled.p`
  margin-top: 2px;
  margin-bottom: 3px;
  font-size: 12px;
  color: #e13247;
  height: 20px;
  font-weight: 400;
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`
const TextWrapper = styled.div`
  width: 300px;
  overflow-wrap: break-word;
`

const CancelButton = styled.button`
  margin-top: 16px;
  background-color: #dcdbdc;
`

const SettingsPage = () => {
  const dispatch = useDispatch()
  const authToken = useSelector(state => state.authToken)
  const userDetails = useSelector(state => state.userDetails)
  const changeUsernameForm = useRef(null)
  const changeEmailForm = useRef(null)
  const changePasswordForm = useRef(null)

  const [settingsData, setSettingsData] = useState({
    oldEmail: "",
    newName: "",
    newEmail: "",
    confirmedEmail: "",
    oldPassword: "",
    newPassword: "",
    confirmedPassword: "",
  })

  const [deleteData, setDeleteData] = useState({
    nameOrEmail: "",
    verification: "",
  })

  const [nameError, setNameError] = useState()

  const [emailError, setEmailError] = useState({
    oldEmailError: "",
    newEmailError: "",
    confirmedEmailError: "",
  })

  const [passwordError, setPasswordError] = useState({
    oldPasswordError: "",
    newPasswordError: "",
    confirmedPasswordError: "",
  })

  const [deleteError, setDeleteError] = useState({
    nameOrEmailError: "",
    verificationError: "",
  })

  useEffect(() => {
    if (!authToken) {
      navigate("/login")
    }
  }, [])

  const changeName = async e => {
    e.preventDefault()

    let nameErrorMsg = ""

    try {
      await axios({
        method: "post",
        url: "http://localhost:3000/api/settings/name",
        data: [userDetails["userData"]._id, settingsData],
        headers: { "auth-token": authToken.token },
      })

      setNameError("")

      alert("Your username has been changed")

      dispatch(
        getUserData({ ...userDetails["userData"], name: settingsData.newName })
      )

      setSettingsData({ ...settingsData, newName: "" })

      changeUsernameForm.current.reset()
    } catch (error) {
      if (error.response.data.errors) {
        nameErrorMsg = error.response.data.errors[0].message
      }

      if (
        error.response.data.errors === null &&
        error.response.data.name === true
      ) {
        nameErrorMsg = "Username is already taken"
      }

      setNameError(nameErrorMsg)
    }
  }

  const changeEmail = async e => {
    e.preventDefault()

    let oldEmailMsg = null
    let newEmailMsg = null
    let confirmedEmailMsg = null

    try {
      await axios({
        method: "post",
        url: "http://localhost:3000/api/settings/email",
        data: [userDetails["userData"]._id, settingsData],
        headers: { "auth-token": authToken.token },
      })

      alert("Your email has been changed")

      dispatch(
        getUserData({
          ...userDetails["userData"],
          email: settingsData.newEmail,
        })
      )

      setEmailError({
        oldEmailError: null,
        newEmailError: null,
        confirmedEmailError: null,
      })

      setSettingsData({
        ...settingsData,
        oldEmail: "",
        newEmail: "",
        confirmedEmail: "",
      })

      changeEmailForm.current.reset()
    } catch (error) {

      if (
        error.response.data.errors &&
        error.response.data.errors.find(
          element => element.context.key === "oldEmail"
        )
      ) {
        oldEmailMsg = error.response.data.errors.find(
          element => element.context.key === "oldEmail"
        ).message
      }

      if (
        error.response.data.errors &&
        error.response.data.errors.find(
          element => element.context.key === "newEmail"
        )
      ) {
        newEmailMsg = error.response.data.errors.find(
          element => element.context.key === "newEmail"
        ).message
      }

      if (
        error.response.data.errors &&
        error.response.data.errors.find(
          element => element.context.key === "confirmedEmail"
        )
      ) {
        confirmedEmailMsg = error.response.data.errors.find(
          element => element.context.key === "confirmedEmail"
        ).message
      }

      if (error.response.data.oldEmail === false) {
        oldEmailMsg = "Incorrect email"
      }

      if (error.response.data.newEmail === true) {
        newEmailMsg = "New email is already taken"
      }

      if (error.response.data.confirmedEmail === false) {
        confirmedEmailMsg = "Confirmed email doesn't match new email"
      }

      setEmailError({
        oldEmailError: oldEmailMsg,
        newEmailError: newEmailMsg,
        confirmedEmailError: confirmedEmailMsg,
      })
    }
  }

  const changePassword = async e => {
    e.preventDefault()

    let oldPasswordMsg = null
    let newPasswordMsg = null
    let confirmedPasswordMsg = null

    try {
      await axios({
        method: "post",
        url: "http://localhost:3000/api/settings/password",
        data: [userDetails["userData"]._id, settingsData],
        headers: { "auth-token": authToken.token },
      })

      alert("Your password has been changed")

      setPasswordError({
        oldPasswordError: "",
        newPasswordError: "",
        confirmedPasswordError: "",
      })

      setSettingsData({
        ...settingsData,
        oldPassword: "",
        newPassword: "",
        confirmedPassword: "",
      })

      changePasswordForm.current.reset()
    } catch (error) {

      if (error.response.data.oldPassword === false) {
        oldPasswordMsg = "Incorrect email"
      }

      if (error.response.data.confirmedPassword === false) {
        confirmedPasswordMsg = "Confirmed password doesn't match new password"
      }

      if (error.response.data.newPassword === false) {
        newPasswordMsg = "New password is the same as old password"
      }

      if (
        error.response.data.errors &&
        error.response.data.errors.find(
          element => element.context.key === "oldPassword"
        )
      ) {
        oldPasswordMsg = error.response.data.errors.find(
          element => element.context.key === "oldPassword"
        ).message
      }

      if (
        error.response.data.errors &&
        error.response.data.errors.find(
          element => element.context.key === "newPassword"
        )
      ) {
        newPasswordMsg = error.response.data.errors.find(
          element => element.context.key === "newPassword"
        ).message
      }

      if (
        error.response.data.errors &&
        error.response.data.errors.find(
          element => element.context.key === "confirmedPassword"
        )
      ) {
        confirmedPasswordMsg = error.response.data.errors.find(
          element => element.context.key === "confirmedPassword"
        ).message
      }

      setPasswordError({
        oldPasswordError: oldPasswordMsg,
        newPasswordError: newPasswordMsg,
        confirmedPasswordError: confirmedPasswordMsg,
      })
    }
  }

  const deleteAccount = async () => {
    let nameOrEmailMsg = null
    let verificationMsg = null

    try {
      await axios({
        method: "post",
        url: "http://localhost:3000/api/settings/delete",
        data: [userDetails["userData"]._id, deleteData],
        headers: { "auth-token": authToken.token },
      })

      dispatch(getToken(null))
      navigate("/login")
      alert("Your account has been deleted")

    } catch (error) {

      if (error.response.data.nameOrEmail !== true) {
        nameOrEmailMsg = "Incorrect username or email"
      }

      if (error.response.data.verification === false) {
        verificationMsg = "Incorrect verification"
      }

      if (
        error.response.data.errors &&
        error.response.data.errors.find(
          element => element.context.key === "nameOrEmail"
        )
      ) {
        nameOrEmailMsg = error.response.data.errors.find(
          element => element.context.key === "nameOrEmail"
        ).message
      }

      if (
        error.response.data.errors &&
        error.response.data.errors.find(
          element => element.context.key === "verification"
        )
      ) {
        verificationMsg = error.response.data.errors.find(
          element => element.context.key === "verification"
        ).message
      }
    }

    setDeleteError({
      nameOrEmailError: nameOrEmailMsg,
      verificationError: verificationMsg,
    })
  }

  const renderSettings = () => {
    if (authToken !== null) {
      return (
        <Layout title={"Settings"}>
          <Container>
            <h1 style={{ paddingTop: "29px" }}>Settings</h1>
            <form ref={changeUsernameForm}>
              <TextWrapper>
                <p>
                  Change username -{" "}
                  <strong>{userDetails["userData"].name}</strong>
                </p>
              </TextWrapper>
              <input
                placeholder="New username"
                onChange={e =>
                  setSettingsData({ ...settingsData, newName: e.target.value })
                }
              />
              <ValidationMsg>{nameError}</ValidationMsg>
              <button onClick={changeName}>Change username</button>
            </form>
            <form ref={changeEmailForm}>
              <TextWrapper>
                <p>
                  Change email -{" "}
                  <strong>{userDetails["userData"].email}</strong>
                </p>
              </TextWrapper>
              <input
                placeholder="Old email"
                onChange={e =>
                  setSettingsData({ ...settingsData, oldEmail: e.target.value })
                }
              />
              <ValidationMsg>{emailError.oldEmailError}</ValidationMsg>
              <input
                placeholder="New email"
                onChange={e =>
                  setSettingsData({ ...settingsData, newEmail: e.target.value })
                }
              />
              <ValidationMsg>{emailError.newEmailError}</ValidationMsg>
              <input
                placeholder="Confirm new email"
                onChange={e =>
                  setSettingsData({
                    ...settingsData,
                    confirmedEmail: e.target.value,
                  })
                }
              />
              <ValidationMsg>{emailError.confirmedEmailError}</ValidationMsg>
              <button onClick={changeEmail}>Change email</button>
            </form>
            <form ref={changePasswordForm}>
              <p>Change password</p>
              <input
                placeholder="Old password"
                style={{ WebkitTextSecurity: "disc" }}
                onChange={e =>
                  setSettingsData({
                    ...settingsData,
                    oldPassword: e.target.value,
                  })
                }
              />
              <ValidationMsg>{passwordError.oldPasswordError}</ValidationMsg>
              <input
                placeholder="New password"
                style={{ WebkitTextSecurity: "disc" }}
                onChange={e =>
                  setSettingsData({
                    ...settingsData,
                    newPassword: e.target.value,
                  })
                }
              />
              <ValidationMsg>{passwordError.newPasswordError}</ValidationMsg>
              <input
                placeholder="Confirm new password"
                style={{ WebkitTextSecurity: "disc" }}
                onChange={e =>
                  setSettingsData({
                    ...settingsData,
                    confirmedPassword: e.target.value,
                  })
                }
              />
              <ValidationMsg>
                {passwordError.confirmedPasswordError}
              </ValidationMsg>
              <button onClick={changePassword}>Change password</button>
            </form>
            <div>
              <p>Delete account</p>
              <input
                placeholder="Your username or email"
                onChange={e =>
                  setDeleteData({ ...deleteData, nameOrEmail: e.target.value })
                }
              />
              <ValidationMsg>{deleteError.nameOrEmailError}</ValidationMsg>
              <input
                placeholder='To verify, type "delete my account"'
                onChange={e =>
                  setDeleteData({ ...deleteData, verification: e.target.value })
                }
              />
              <ValidationMsg>{deleteError.verificationError}</ValidationMsg>
              <button
                onClick={deleteAccount}
                style={{ backgroundColor: "#E13247" }}
              >
                Delete
              </button>
            </div>
            <Link to="/">
              <CancelButton>Back</CancelButton>
            </Link>
          </Container>
        </Layout>
      )
    }
  }

  return <>{renderSettings()}</>
}

export default SettingsPage
