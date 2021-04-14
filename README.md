# SoundCloud for VS Code README

## Features

### Core Features

<details><summary>Search for a track</summary>

![](https://i.imgur.com/eyZbYyW.gif)
</details>
<details><summary>Play, pause, skip, and reverse track</summary>

![](https://i.imgur.com/DbuZzeQ.png)
</details>
<details><summary>Add tracks to the queue</summary>

![](https://i.imgur.com/uKIbDJl.gif)
</details>

<br>

### Features Coming Soon
 - View tracks in the queue
 - Reorder the queue
 - Search for entire playlists


## Requirements

1. [Download VS Code](https://code.visualstudio.com/download)
2. [Download Node.js](https://nodejs.org/en/download/)
3. [Download the SoundCloud for VS Code repository](https://github.com/owen-hunter1/soundcloud-for-vs-code)
4. Open the repository in VS Code (File -> Open Folder...; Ctrl + K, Ctrl + O)
5. Open a terminal window in VS Code and enter the following command (View -> Terminal; Ctrl + `)
6. `npm install`

## Build

### Build and Run

1. Open the repository in VS Code (File -> Open Folder...; Ctrl + K, Ctrl + O)
2. Run the extension in VS Code (Run -> Start Debugging; F5)

### Build and Run Tests

1. Click on the Run and Debug button on the left side of the VS Code window (Ctrl + Shift + D)
2. At the top left of the VS Code window, next to the green play button select "Extension Tests"
3. Run the extension in VS Code (Run -> Start Debugging; F5)

## Figure Generation

### Requirements

1. Install Python and pip
2. `pip3 install numpy`
3. `pip3 install plotly`
4. `pip3 install dash`

### Generation

1. Move to the figures directory (`cd figures/`)
2. Run generate_table.py (`python3 generate_table.py`)
3. Follow the instructions that are printed when running generate_table.py
4. Open the link that follows "Dash is running on" (It should look something like http://127.0.0.1:8050/)
5. The table can be saved using the "Download plot as png" button in the top left.