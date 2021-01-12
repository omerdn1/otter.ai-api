# otter.ai-api

This is an unofficial API for [otter.ai](http://otter.ai)'s speech-to-text service.

## Contents

- [Installation](#installation)
- [Setup](#setup)
- [Methods](#methods)
  - [Get Speeches](#get-speeches)
  - [Get Speech](#get-speech)
  - [Speech Search](#speech-search)
  - [TODO: add all methods](#todo--add-all-methods)
- [License](#license)

## Installation

`npm install --save otter.ai-api`

## Setup

```jsonc
import OtterApi from 'otter.ai-api';

const otterApi = new OtterApi({
  email: 'email@example.com', // Your otter.ai email
  password: 'abc123!#', // Your otter.ai password
});

await otterApi.init() // Performs login
```

## Methods

### Get Speeches

Receive an array of all user speeches

**Method**:

```js
await otterApi.getSpeeches();
```

**Response**:

```jsonc
[
    ...
    {
        "speech_id": "77NXWSPLSSXQ56JU", // Speech ID
        "start_time": 1174447006, // Start date in Unix Epoch
        "end_time": 0,
        "modified_time": 1174447006, // Last modified date in Unix Epoch
        "deleted": false,
        "duration": 250, // Duration of the speech in seconds
        "title": "Example Title", // Title
        "summary": "example, test, sample, showcase", // Keywords
        "from_shared": false,
        "shared_with": [],
        "unshared": false,
        "shared_by": null,
        "owner": {}, // Owner info
        "shared_groups": [],
        "can_edit": true,
        "can_comment": true,
        "is_read": false,
        "process_finished": true,
        "upload_finished": true,
        "hasPhotos": 0,
        "download_url": "https://downloadurl.com", // Download URL
        "transcript_updated_at": 1174447006, // Last transcript update date in Unix Epoch
        "images": [],
        "speakers": [], // Array of speakers
        "word_clouds": [], // Word cloud
        "live_status": "none",
        "live_status_message": "",
        "public_share_url": null,
        "folder": null,
        "created_at": 1174447006 // Creation date in Unix Epoch
    },
    ...
]
```

### Get Speech

Receive an object of a particular speech

**Method**:

```js
await otterApi.getSpeech(speechId);
```

**Parameters**:

- `speechId` - **required**, an ID of the speech.

**Response**:

```jsonc
{
    ...getSpeeches response,
    "transcripts": [
        ...
        {
            "start_offset": 132400, // Transcript start offset in milliseconds
            "end_offset": 191240, // Transcript end offset in milliseconds
            "speaker_model_label": null,
            "transcript": "This is a sample transcript.", // Transcript
            "id": 9928892812, // Transcript ID
            "alignment": [], // Word timestamps
            "speaker_id": null, // Speaker ID
            "uuid": "l12322lx-21b4-4623-a51f-lkdlsd2132", // Transcript UUID
            "speaker_edited_at": null,
            "created_at": "2019-12-19 14:29:21", // Trasncript creation date
            "label": null, // Transcript label
            "sig": "",
            "speech_id": "77NXWSPLSSXQ56JU" // Speech ID
        }
        ...
    ]
}
```

### Speech Search

Receive an array of search results given a particular query

**Method**:

```js
await otterApi.speechSearch(query);
```

**Parameters**:

- `query` - **required**, a search query

**Response**:

```jsonc
[
    ...
    {
        "user_id": 1111117, // User ID
        "title": "Example Title", // Speech title
        "start_time": 1174447006, // Start date in Unix Epoch
        "matched_transcripts": [
            ...
            {
                "transcript_id": 9928892812, // Transcript ID
                "matched_transcript": "This is a sample transcript.", // Transcript
                "highlight_spans": [], // Highlight spans over transcript
            },
            ...
            "groups": [],
            "appid": null,
            "duration": 250, // Duration of the speech in seconds
            "speech_id": "77NXWSPLSSXQ56JU" // Speech ID
        ]
        ...
    }
]
```

### TODO: add all methods

## License

MIT
