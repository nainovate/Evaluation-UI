# Dataset Selection - Test Cases
# Overview
Test Suite	    Total Cases	      Priority	Status
UI/UX Tests	        15	           High	     ✅
File Upload Tests	12	           Critical	✅
Validation Tests	18	            Critical	✅
Dataset Selection 	10	            High	✅
Navigation Tests	8	            Medium	✅
Responsive Design 	6	            Medium	✅
		
1. UI/UX Test Cases
TC001: Page Load and Layout
Priority: High
Description: Verify page loads correctly with all components

Steps:

Navigate to /evaluation/dataset-selection
Wait for page to fully load
Expected Results:

✅ Progress stepper displays at top (Step 1 active)
✅ "Select Evaluation Dataset" header visible
✅ Upload section with all fields visible
✅ Existing datasets section loads
✅ Evaluation guide fixed on right side
✅ Navigation buttons at bottom
Test Data: N/A

TC002: Progress Stepper Display
Priority: High
Description: Verify progress stepper shows correct state

Steps:

Load the dataset selection page
Observe progress stepper
Expected Results:

✅ Step 1 "Select Dataset" highlighted in blue
✅ Steps 2-5 shown in gray (inactive)
✅ Stepper remains fixed when scrolling
✅ All step names visible: Select Dataset, Choose Model, Configure Metrics, Review & Run, Success
TC003: Theme Toggle Functionality
Priority: Medium
Description: Test dark/light mode switching

Steps:

Load page in light mode
Click theme toggle button
Verify dark mode activation
Click again to return to light mode
Expected Results:

✅ Theme toggles between light and dark
✅ All components adapt to theme
✅ Colors and contrast remain accessible
✅ Fixed elements maintain proper styling
TC004: Responsive Design - Mobile
Priority: Medium
Description: Test layout on mobile devices

Steps:

Load page on mobile viewport (375px width)
Test all interactions
Expected Results:

✅ Layout stacks vertically
✅ Evaluation guide not fixed (flows normally)
✅ Upload area remains functional
✅ Navigation buttons accessible
✅ Text remains readable
TC005: Responsive Design - Tablet
Priority: Medium
Description: Test layout on tablet devices

Steps:

Load page on tablet viewport (768px width)
Verify layout adapts properly
Expected Results:

✅ Components resize appropriately
✅ Evaluation guide behavior adapts
✅ Grid layout functions correctly
✅ Touch interactions work
2. File Upload Test Cases
TC006: Valid CSV Upload
Priority: Critical
Description: Upload valid CSV file with correct columns

Test Data:

csv
question,expected_answer,context
"What is AI?","Artificial Intelligence","Technology"
"How to login?","Click login button","User Guide"
Steps:

Fill dataset name: "Test QA Dataset"
Select task type: "Question Answering"
Upload CSV file
Click "Preview & Save"
Expected Results:

✅ File uploads successfully
✅ Preview shows correct data
✅ Validation passes (green checkmark)
✅ Dataset saves to collection
TC007: Invalid File Format
Priority: Critical
Description: Attempt to upload unsupported file format

Test Data: test.txt file

Steps:

Try to upload .txt file
Observe system response
Expected Results:

✅ File rejected during selection
✅ Only CSV, JSON, YAML accepted
✅ Clear error message displayed
✅ Upload area remains active
TC008: File Size Limit Test
Priority: High
Description: Upload file exceeding 10MB limit

Test Data: 15MB CSV file

Steps:

Attempt to upload large file
Monitor upload progress
Expected Results:

✅ Upload rejected with size error
✅ Clear message about 10MB limit
✅ Upload area resets
✅ No partial upload occurs
TC009: Empty File Upload
Priority: Medium
Description: Upload empty or corrupted file

Test Data: Empty CSV file (0 bytes)

Steps:

Upload empty file
Attempt to preview
Expected Results:

✅ File upload completes
✅ Validation fails with clear message
✅ Preview shows "No data found"
✅ Save button remains disabled
TC010: Upload Progress Indicator
Priority: Medium
Description: Verify upload progress shows correctly

Test Data: 5MB CSV file

Steps:

Upload moderately large file
Observe progress indicator
Expected Results:

✅ Progress bar appears
✅ Percentage increases from 0-100%
✅ Upload status text updates
✅ Success state shows clearly
3. Validation Test Cases
TC011: Question Answering Validation - Valid
Priority: Critical
Description: Test valid QA dataset validation

Test Data:

csv
question,expected_answer,context,category
"What is ML?","Machine Learning","AI concepts","technical"
Steps:

Upload CSV with correct QA columns
Set task type to "Question Answering"
Open preview modal
Expected Results:

✅ Validation passes
✅ Green success message
✅ All required columns detected
✅ "Select Dataset" button enabled
TC012: Question Answering Validation - Invalid
Priority: Critical
Description: Test invalid QA dataset (missing columns)

Test Data:

csv
question,wrong_column
"What is ML?","Some answer"
Steps:

Upload CSV missing required columns
Set task type to "Question Answering"
Open preview modal
Expected Results:

✅ Validation fails
✅ Red error message displayed
✅ Lists missing columns: "expected_answer, context"
✅ "Select Dataset" button disabled
TC013: Summarization Validation - Valid
Priority: Critical
Description: Test valid summarization dataset

Test Data:

csv
input_text,reference_summary,length_constraint
"Long article...","Short summary...","100 words"
Steps:

Upload summarization CSV
Set task type to "Summarization"
Validate dataset
Expected Results:

✅ Validation passes
✅ Required columns detected
✅ Optional columns recognized
✅ Success indicator shown
TC014: Classification Validation - Invalid
Priority: High
Description: Test classification with wrong column names

Test Data:

csv
text,label
"Good product","positive"
Steps:

Upload CSV with wrong column names
Set task type to "Classification"
Check validation
Expected Results:

✅ Validation fails
✅ Error: "Missing mandatory columns: input_text, expected_label"
✅ Clear guidance on correct names
✅ Preview shows but selection disabled
TC015: Structured Output Validation
Priority: High
Description: Test structured output dataset validation

Test Data:

csv
input_text,expected_json,schema_type,difficulty
"Extract name: John Doe","{\"name\": \"John Doe\"}","person","easy"
Steps:

Upload structured output CSV
Set task type to "Structured Output"
Validate
Expected Results:

✅ All required columns found
✅ Validation passes
✅ Optional difficulty column recognized
✅ JSON content validated
TC016: Conversational QA Validation
Priority: High
Description: Test conversational QA dataset

Test Data:

csv
conversation_history,question,expected_answer,context
"User: Hi\nBot: Hello","Need help","How can I assist?","support"
Steps:

Upload conversational QA data
Set task type to "Conversational QA"
Validate structure
Expected Results:

✅ Multi-turn format recognized
✅ All required columns present
✅ Context column optional but detected
✅ Validation successful
TC017: Retrieval Validation
Priority: High
Description: Test retrieval dataset validation

Test Data:

csv
query,relevant_documents,irrelevant_documents,relevance_scores
"AI research","doc1,doc2","doc3,doc4","0.9,0.8"
Steps:

Upload retrieval dataset
Set task type to "Retrieval"
Check validation
Expected Results:

✅ Document lists parsed correctly
✅ Relevance scores optional but recognized
✅ Query format validated
✅ All requirements met
TC018: Mixed Validation Scenarios
Priority: Medium
Description: Test validation with multiple task types

Steps:

Upload dataset without selecting task type
Try different task type selections
Observe validation changes
Expected Results:

✅ General validation without task type
✅ Specific validation when task selected
✅ Dynamic error messages update
✅ Requirements change appropriately
4. Dataset Selection Test Cases
TC019: Select Existing Valid Dataset
Priority: Critical
Description: Select pre-existing valid dataset

Steps:

Click on valid dataset card
Review preview modal
Click "Select Dataset"
Verify selection
Expected Results:

✅ Preview modal opens
✅ Dataset details displayed correctly
✅ Validation shows as passed
✅ Selection completes successfully
✅ "Next: Choose Model" button enables
TC020: Select Existing Invalid Dataset
Priority: High
Description: Attempt to select invalid dataset

Steps:

Click on invalid dataset card
Review preview modal
Attempt selection
Expected Results:

✅ Preview opens with warnings
✅ Validation errors clearly shown
✅ "Select Dataset" button disabled
✅ Error explanation provided
TC021: Dataset Preview Modal
Priority: High
Description: Test dataset preview functionality

Steps:

Click any dataset card
Review modal contents
Test modal controls
Expected Results:

✅ Modal opens with dataset info
✅ Sample data displayed (first 5 rows)
✅ Column information shown
✅ Statistics panel present
✅ Close/cancel buttons work
TC022: Switch Between Datasets
Priority: Medium
Description: Select different datasets in sequence

Steps:

Select dataset A
Select dataset B
Verify selection updates
Expected Results:

✅ Previous selection clears
✅ New selection highlights
✅ Metadata updates correctly
✅ Navigation remains enabled
5. Form Input Test Cases
TC023: Dataset Name Validation
Priority: High
Description: Test dataset name field validation

Steps:

Leave name field empty
Try to save dataset
Fill valid name
Test save again
Expected Results:

✅ Required field validation
✅ Save disabled when empty
✅ Auto-fill from filename works
✅ Save enables with valid name
TC024: Description Field
Priority: Low
Description: Test description field functionality

Steps:

Enter long description (500+ chars)
Test special characters
Test line breaks
Expected Results:

✅ Field accepts long text
✅ Special characters handled
✅ Line breaks preserved
✅ Optional field works correctly
TC025: Task Type Selection
Priority: High
Description: Test task type dropdown

Steps:

Open task type dropdown
Select each option
Verify suggested tags appear
Expected Results:

✅ All 6 task types listed
✅ Selection updates validation
✅ Suggested tags appear
✅ Validation adapts to selection
TC026: Tag Management
Priority: Medium
Description: Test tag addition and removal

Steps:

Select task type
Click suggested tags
Add custom tag
Remove tags
Expected Results:

✅ Suggested tags toggleable
✅ Custom tag input works
✅ Tags display correctly
✅ Removal functions properly
TC027: Custom Tag Input
Priority: Medium
Description: Test custom tag functionality

Steps:

Click "Add Custom Tag"
Enter tag name
Press Enter
Test special characters
Expected Results:

✅ Input field appears
✅ Enter key adds tag
✅ Special chars handled appropriately
✅ Cancel functionality works
6. Navigation Test Cases
TC028: Back Button Functionality
Priority: High
Description: Test back navigation

Steps:

Click "Back" button
Verify navigation
Expected Results:

✅ Returns to evaluation dashboard
✅ No data loss warnings needed
✅ Navigation smooth and immediate
TC029: Next Button State Management
Priority: Critical
Description: Test next button enable/disable logic

Steps:

Load page (no selection)
Select invalid dataset
Select valid dataset
Check button states
Expected Results:

✅ Initially disabled
✅ Remains disabled for invalid dataset
✅ Enables for valid dataset
✅ Visual state changes clear
TC030: Next Button Navigation
Priority: High
Description: Test proceeding to next step

Steps:

Select valid dataset
Click "Next: Choose Model"
Verify navigation
Expected Results:

✅ Navigates to model selection page
✅ Dataset selection persisted
✅ Progress stepper updates
✅ Metadata saved correctly
7. Error Handling Test Cases
TC031: Network Error Handling
Priority: Medium
Description: Test behavior with network issues

Steps:

Simulate network disconnection
Attempt file upload
Try dataset operations
Expected Results:

✅ Graceful error messages
✅ Retry mechanisms available
✅ User informed of issue
✅ No data corruption
TC032: Backend Unavailable
Priority: Medium
Description: Test with backend service down

Steps:

Mock backend unavailability
Test all operations
Verify fallback behavior
Expected Results:

✅ Fallback to mock data
✅ Clear indication of mock usage
✅ Core functionality maintained
✅ User can continue workflow
TC033: Browser Compatibility
Priority: Medium
Description: Test across different browsers

Browsers: Chrome, Firefox, Safari, Edge

Steps:

Load page in each browser
Test core functionality
Verify consistent behavior
Expected Results:

✅ Consistent appearance
✅ All features functional
✅ Performance acceptable
✅ No browser-specific errors
8. Performance Test Cases
TC034: Large Dataset Handling
Priority: Medium
Description: Test with large dataset files

Test Data: 9MB CSV with 10,000 rows

Steps:

Upload large dataset
Monitor performance
Test preview functionality
Expected Results:

✅ Upload completes successfully
✅ Preview loads within 3 seconds
✅ Only first 5 rows shown
✅ No browser freezing
TC035: Multiple File Operations
Priority: Low
Description: Test rapid file operations

Steps:

Upload file
Immediately cancel
Upload different file
Repeat sequence
Expected Results:

✅ Operations handle gracefully
✅ No memory leaks
✅ UI remains responsive
✅ State management correct
Test Execution Guidelines
Pre-Test Setup
Clear browser cache and cookies
Ensure latest version deployed
Verify test data files prepared
Check network connectivity
Test Environment
Browser: Latest Chrome, Firefox, Safari, Edge
Resolution: 1920x1080 (desktop), 375x667 (mobile)
Network: Stable broadband connection
Data: Clean test datasets prepared
Pass/Fail Criteria
Pass: All expected results achieved
Fail: Any expected result not met
Blocked: Cannot complete due to environment issue
Reporting
Document all failures with screenshots
Include browser/OS information
Note reproduction steps
Assign severity levels
Test Coverage: 69 test cases covering UI, functionality, validation, performance, and error handling scenarios.

