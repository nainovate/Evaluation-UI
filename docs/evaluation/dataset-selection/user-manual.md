## Evaluation Dataset Selection 

## Overview
The Evaluation Dataset Selection page allows you to choose or upload datasets for evaluating AI model performance. This is the first step in the evaluation workflow, where you define the data that will be used to test your model's accuracy and effectiveness.

## Key Features
✅ Upload new evaluation datasets (YAML)
✅ Browse and select from existing datasets
✅ Preview dataset structure and content
✅ Validate dataset compatibility
✅ Add metadata (name, description, task type, tags)
✅ Task-specific column validation
## Getting Started

Access to the evaluation dashboard
Evaluation dataset file (YAML format)
Understanding of your evaluation task type
# Navigation
Access the evaluation workflow from the main dashboard
You'll start on the "Select Dataset" page (Step 1 of 5)
Progress through: Select Dataset → Choose Model → Configure Metrics → Review & Run → Success
Features
1. Upload New Dataset
Upload your own evaluation dataset with complete metadata management.

Supported Formats:

YAML (YAML Ain't Markup Language)
File Requirements:

Maximum file size: 10MB
Must contain required columns for your task type

2. Dataset Information Fields
Fill out comprehensive metadata for your dataset:

Dataset Name (Required)
Unique identifier for your dataset
Auto-filled from filename if not provided
Used for organization and reference
Description (Optional)
Detailed description of dataset contents
Helps team members understand dataset purpose
Supports evaluation documentation
Task Type (Optional)
Select from 6 supported evaluation types
Triggers task-specific validation
Shows relevant tag suggestions
Tags (Optional)
Organize datasets with custom labels
Get suggestions based on task type
Enable easy filtering and discovery

3. Existing Datasets
Browse and select from previously uploaded datasets.

Features:

Visual dataset cards with metadata
Status indicators (valid/invalid)
Quick preview functionality
Edit and delete options
Search and filtering capabilities

4. Dataset Preview
Preview dataset structure before selection.

Preview Information:

Column names and data types
Sample data rows (first 5)
Validation status
Task-specific requirements
File statistics
Step-by-Step Guide
# Uploading a New Dataset
Fill Dataset Information
📝 Dataset Name: "Customer Support QA Evaluation"
📄 Description: "Questions and expected answers for support chatbot testing"
🏷️ Task Type: "Question Answering"
🔖 Tags: "customer-support", "qa", "evaluation"
# Upload File
1. Drag and drop your file onto the upload area
Or click "Choose File" to browse
Supported formats:  YAML (max 10MB)
Preview and Validate
System automatically validates file structure
2. column names and sample data
Check validation messages
3. Save Dataset
4. Click "Preview & Save" to finalize
Dataset is added to your collection
# Ready for selection
    1. Selecting an Existing Dataset
    2. Browse Available Datasets
    3. View dataset cards with metadata
    4. status indicators
    5. Review task types and tags
Preview Dataset
Click any dataset card to open preview
Review structure and validation
Confirm compatibility
5. Select Dataset
6.  "Select Dataset" in preview modal
Dataset becomes active selection
7. "Next: Choose Model" button enables
Task Types & Requirements
    1. Question Answering
    Description: Models answer questions based on context or knowledge

    Required Columns:

    question - The question to be answered
    expected_answer - The correct/expected answer
    context - Relevant context information
    Optional Columns:

    category - Question category or type
    Example:

    Ex:
    question,expected_answer,context,category
    "How do I reset my password?","Go to settings and click forgot password","User account management","authentication"
    2. Summarization
    Description: Models create concise summaries of longer text

    Required Columns:

    input_text - The text to be summarized
    reference_summary - The expected summary
    Optional Columns:

    length_constraint - Target summary length
    domain - Content domain (news, research, etc.)
    Example:
    input_text,reference_summary,length_constraint,domain
    "Long article text...","Short summary...","100 words","news"
    3. Classification
    Description: Models categorize text into predefined classes

    Required Columns:

    input_text - The text to classify
    expected_label - The correct classification
    Optional Columns:

    category - Classification category
    Example:
    input_text,expected_label,category
    "I love this product!","positive","sentiment"
    4. Structured Output
    Description: Models generate structured data like JSON or tables

    Required Columns:

    input_text - The input text
    expected_json - Expected structured output
    schema_type - Type of structure expected
    Optional Columns:

    difficulty - Task difficulty level
    Example:

    input_text,expected_json,schema_type,difficulty
    "Extract customer info from: John Doe, ABC Corp","{\"name\": \"John Doe\", \"company\": \"ABC Corp\"}","customer_info","medium"
    5. Conversational QA
    Description: Multi-turn conversations with context awareness

    Required Columns:

    conversation_history - Previous conversation turns
    question - Current question
    expected_answer - Expected response
    Optional Columns:

    context - Additional context
    Example:


    conversation_history,question,expected_answer,context
    "User: Hello\nBot: Hi! How can I help?","I need support","What type of support do you need?","customer_service"
    6. Retrieval
    Description: Finding and ranking relevant information

    Required Columns:

    query - Search query
    relevant_documents - IDs of relevant documents
    irrelevant_documents - IDs of irrelevant documents
    Optional Columns:

    relevance_scores - Relevance ranking scores
    Example:

    
    query,relevant_documents,irrelevant_documents,relevance_scores
    "machine learning algorithms","doc_123,doc_456","doc_789","0.95,0.87"
# Troubleshooting
Common Issues
❌ "Invalid Dataset Structure"
Problem: Dataset missing required columns Solution:

Check task type requirements
Ensure exact column name matches
Verify column names are spelled correctly
❌ "File Upload Failed"
Problem: File won't upload Solution:

Check file size (max 10MB)
Verify file format (CSV, JSON, YAML only)
Ensure file isn't corrupted
❌ "Preview Shows Wrong Data"
Problem: Data appears incorrect in preview Solution:

Check file encoding (UTF-8 recommended)
Verify delimiter for CSV files
Ensure JSON/YAML syntax is valid
❌ "Next Button Disabled"
Problem: Can't proceed to next step Solution:



