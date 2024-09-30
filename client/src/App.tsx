import { useEffect, useState } from 'react'
import './App.css'
import { useMutation, useQuery } from '@apollo/client'
import { GET_ALL_USERS, GET_ONE_USER } from './query/users'
import { CREATE_USER } from './mutation/user'

function App() {
	const { data, loading, /* error */ refetch } = useQuery(GET_ALL_USERS, {
		pollInterval: 5000,
	})
	const { data: oneUser, /* loading: loadingOneUser */ } = useQuery(GET_ONE_USER, {
		variables: {
			id: 1
		}
	})
	const [newUser] = useMutation(CREATE_USER)
	const [username, setUsername] = useState('')
	const [age, setAge] = useState(0)
	const [users, setUsers] = useState<
		{ username: string; age: number; id: number }[]
	>([])

	console.log(oneUser)

	useEffect(() => {
		if (!loading) {
			setUsers(data.getAllUsers)
		}
	}, [data, loading])

	const addUser = async (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		e.preventDefault()
		const newUserObj = await newUser({
			variables: {
				input: {
					username,
					age,
				},
			},
		})

		setUsername('')
		setAge(0)
		return newUserObj
	}

	const getAll = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.preventDefault()
		await refetch()
	}

	return (
		<div>
			<form>
				<div className="inputs">
					<label>
						Username
						<input
							type="text"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
						/>
					</label>
					<label>
						Age
						<input
							type="number"
							value={age}
							onChange={(e) => setAge(Number(e.target.value))}
						/>
					</label>
				</div>
				<div className="buttons">
					<button onClick={(e) => addUser(e)}>Create</button>
					<button onClick={(e) => getAll(e)}>Get</button>
				</div>
			</form>
			{loading ? (
				<h3>Loading...</h3>
			) : (
				<div className="users">
					{users.map((user) => (
						<div key={user.id} className="user">
							{user.username} {user.age}
						</div>
					))}
				</div>
			)}
		</div>
	)
}

export default App
