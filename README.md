# skeleton-offline-first-client
This project attempts to show the use of an offline-first solution for a create-react-app (CRA) application. 
It uses GraphQL Apollo client for retrieving data from the server, Redux as a local store and redux-offline as a 
client-side offline-first solution. 
At the backend it uses MongoDB, Express and GraphQL (TBD in a parallel repo).
There are certain complexities with allowing both offline-first and Apollo on the client side, namely control
over the store. The solution I chose was to create the redux store manually and pass it to Apollo.
I attempted to document the code well so the solution is clear.

**TODO: add more details here about the challenges and solutions.**

