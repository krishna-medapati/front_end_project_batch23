# Testing Event Registration

## Steps to Test Registration

1. **Start the Server**
   - Make sure MongoDB is running
   - Start the server: `cd server && npm start`
   - Check the console for: `MongoDB connected` and `Server running on port [PORT]`

2. **Check Server Port**
   - Frontend calls: `http://localhost:5001/api/events/...`
   - Server default: `PORT 5000`
   - **IMPORTANT**: Make sure server is running on port 5001, or update frontend to use port 5000

3. **Test Registration as Student**
   - Login as a student
   - Navigate to Calendar or Recommendations
   - Click "Register" on an event
   - Check server console for logs:
     ```
     🔵 Registration attempt: User [userId] for Event [eventId]
     📋 Event before update: "[eventName]" has 0 attendees
     ✅ Student [userId] registered for event [eventId]
     📊 Event "[eventName]" now has 1 registered attendees in database
     📝 Attendees array: [ObjectId('...')]
     ```

4. **Verify in MongoDB Compass**
   - Open MongoDB Compass
   - Navigate to `student-activities` database > `events` collection
   - Find the event document
   - Check the `attendees` array - it should contain ObjectIds

5. **Check in Admin Dashboard**
   - Login as admin
   - Go to Event Management
   - Click "🔄 Refresh" button
   - The "Registered" count should update
   - Click "View Registered Members" to see the list

## Troubleshooting

### If attendees array is still empty:
1. Check server console for errors
2. Verify MongoDB connection is working
3. Check if the registration endpoint is being called (check network tab in browser)
4. Verify the userId in the JWT token is valid
5. Check server logs for any validation errors

### If count shows 0 but students registered:
1. Click the "🔄 Refresh" button
2. Check server console for the count logs
3. Verify the GET endpoint is returning the correct count

## Test Endpoint

You can test the database directly:
```
GET http://localhost:5001/api/events/test/[eventId]
```

This will return the raw event data including the attendees array.

