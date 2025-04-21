#!/bin/bash

# Function to convert image to base64
convert_image_to_base64() {
    base64 -w 0 "$1"
}

# Function to download image from Picsum
download_picsum_image() {
    local id=$1
    local filename=$2
    curl -s "https://picsum.photos/seed/project${id}/800/600" -o "$filename"
}

# Get the current timestamp in nanoseconds (1 week from now)
EXPIRED_TIME=$(( $(date +%s) * 1000000000 + 604800000000000 ))

# Sample project categories
CATEGORIES=("Research" "Innovation" "Education" "Community" "Technology" "Sustainability" "Social Impact")

# Sample project titles
TITLES=(
    "Open Source Research Collaboration"
    "Student Innovation Challenge"
    "Educational Content Creation"
    "Community Knowledge Sharing"
    "Tech Mentorship Program"
    "Sustainable Development Workshop"
    "Social Impact Documentation"
)

# Sample project descriptions
DESCRIPTIONS=(
    "Collaborate on research projects focusing on emerging technologies and their impact on society"
    "Join a challenge to develop innovative solutions for local community problems"
    "Create educational content to help others learn about technology and innovation"
    "Share knowledge and experiences through community-driven learning sessions"
    "Participate in mentorship program to guide aspiring technologists"
    "Develop sustainable solutions for environmental challenges through workshops"
    "Document and share stories of social impact initiatives in technology"
)

# Create dummy images directory if it doesn't exist
mkdir -p dummy-images

# Download images from Picsum
echo "Downloading images from Picsum..."
for i in {1..7}; do
    download_picsum_image $i "dummy-images/project$i.png"
    echo "Downloaded image $i/7"
done

# Loop through and create projects
echo "Creating projects..."
for i in {0..6}; do
    # Convert image to base64
    IMAGE_BASE64=$(convert_image_to_base64 "dummy-images/project$(($i + 1)).png")
    
    # Create project using dfx
    echo "Creating project ${i+1}/7: ${TITLES[$i]}"
    dfx canister call backend createProject "record { 
        title = \"${TITLES[$i]}\"; 
        description = \"${DESCRIPTIONS[$i]}\"; 
        expiredAt = ${EXPIRED_TIME}; 
        reward = 50; 
        image = opt blob \"$(echo -n "$IMAGE_BASE64")\"; 
        category = \"${CATEGORIES[$i]}\"; 
        maxParticipants = 10 
    }"
    
    sleep 2
done

# Clean up dummy images
rm -rf dummy-images

echo "Successfully generated dummy projects with Picsum images!" 