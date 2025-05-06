#!/bin/bash

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"


# Create and use dummy identity
echo "Creating dummy identity..."
dfx identity new dummy-community --disable-encryption || true
dfx identity use dummy-community

# Register a new community
echo "Registering dummy community..."
dfx canister call backend register '(record { name = "Lumora Official Hub"; registerAs = "community" })'

# Get current timestamp in nanoseconds
CURRENT_TIME=$(date +%s)
NANO_MULTIPLIER=1000000000

# Calculate various timestamps
NOW=$(( CURRENT_TIME * NANO_MULTIPLIER ))
ONE_WEEK=$(( 7 * 24 * 60 * 60 * NANO_MULTIPLIER ))
TWO_WEEKS=$(( 14 * 24 * 60 * 60 * NANO_MULTIPLIER ))
ONE_MONTH=$(( 30 * 24 * 60 * 60 * NANO_MULTIPLIER ))

# Sample project categories
CATEGORIES=(
    "energy"
    "water"
    "waste"
    "transportation"
    "agriculture"
    "forestry"
    "biodiversity"
)

# Sample impacts
IMPACTS=(
    "3.5 tons plastic removed"
    "2.8 tons CO2 reduced"
    "4.2 tons waste recycled"
    "5.0 tons emissions avoided"
)

# Sample addresses (Indonesian cities)
ADDRESSES=(
    "Bandung, Indonesia"
    "Jakarta Selatan, Indonesia"
    "Yogyakarta, Indonesia"
    "Surabaya, Indonesia"
)

# Sample project titles
TITLES=(
    "Open Source Research Collaboration"
    "Student Innovation Challenge" 
    "Educational Content Creation"
    "Community Knowledge Sharing"
)

# Sample project descriptions
DESCRIPTIONS=(
    "Collaborate on research projects focusing on emerging technologies and their impact on society. This project will involve quarterly research sprints, monthly progress reports, and bi-weekly team meetings. We'll establish research clusters focusing on AI ethics, blockchain applications, and sustainable tech solutions. Each participant will contribute to at least one research paper and present findings at our virtual symposium. The project aims to create a comprehensive knowledge base of emerging technologies and their societal implications. Through collaborative research, we'll explore ethical considerations, potential applications, and risk mitigation strategies. Regular workshops and expert sessions will be conducted to ensure high-quality research output. The final deliverables will include research papers, case studies, and policy recommendations that can guide future technological development."
    "Join a challenge to develop innovative solutions for local community problems. The program runs for 3 months with weekly milestones. Teams will identify local issues, conduct user research, prototype solutions, and present to community stakeholders. We'll provide mentorship, technical resources, and a $5000 prize pool for winning solutions. Regular workshops on design thinking and rapid prototyping will be conducted. The challenge focuses on addressing real-world problems through innovative technology solutions. Teams will work closely with community members to understand their needs and develop practical solutions. The program includes access to prototyping tools, cloud resources, and expert mentorship. Final solutions will be evaluated based on their impact, feasibility, and sustainability. Winning teams will receive funding to implement their solutions and ongoing support for scaling their impact."
    "Create educational content to help others learn about technology and innovation. This initiative spans 6 months with monthly content themes. Participants will create video tutorials, written guides, and interactive workshops. We'll provide content creation tools, training on educational design, and a platform to host materials. Each contributor will create at least 5 pieces of content and receive feedback from industry experts. The project aims to democratize access to technology education through high-quality, engaging content. Content creators will focus on making complex technical concepts accessible to beginners while maintaining accuracy and depth. The program includes training in instructional design, multimedia production, and educational psychology. Regular peer reviews and expert feedback sessions will ensure content quality. The final content library will be made freely available to the community, with special attention to accessibility and localization."
    "Share knowledge and experiences through community-driven learning sessions. The program includes weekly virtual meetups, monthly workshops, and quarterly hackathons. We'll establish special interest groups for different tech domains, organize peer review sessions, and maintain a knowledge base. Participants will lead at least one session and contribute to our community documentation. The initiative focuses on creating a vibrant learning community where members can share expertise and learn from each other. Special interest groups will cover topics like AI, blockchain, cybersecurity, and sustainable tech. Each session will be recorded and documented for future reference. The program includes training in facilitation, public speaking, and community building. Regular networking events will help participants build professional connections. The knowledge base will serve as a valuable resource for the broader community."
)

# Function to create a temporary file with the project data
create_project_data_file() {
    local title=$1
    local description=$2
    local startDate=$3
    local expiredAt=$4
    local reward=$5
    local imageData=$6
    local category=$7
    local maxParticipants=$8
    local impact=$9
    local address=${10}
    
    # Create a temporary file
    local temp_file=$(mktemp)
    
    # Write the project data to the temporary file
    cat > "$temp_file" << EOF
record { 
    title = "$title"; 
    description = "$description"; 
    startDate = $startDate; 
    expiredAt = $expiredAt; 
    reward = $reward; 
    imageData = $imageData; 
    category = variant { $category }; 
    maxParticipants = $maxParticipants;
    impact = "$impact";
    address = "$address"
}
EOF
    
    echo "$temp_file"
}

# Loop through and create projects
echo "Creating projects..."
for i in {0..3}; do
    # Generate random reward between 1-20
    RANDOM_REWARD=$((RANDOM % 20 + 1))
    # Generate random max participants between 100-250
    RANDOM_MAX_PARTICIPANTS=$((RANDOM % 151 + 100))
    # Get random impact and address (cycling through the arrays)
    IMPACT_INDEX=$((i % ${#IMPACTS[@]}))
    ADDRESS_INDEX=$((i % ${#ADDRESSES[@]}))
    
    # Calculate dates based on project index to create a mix of statuses
    case $((i % 4)) in
        0) # Active projects (current - 1 week to current + 2 weeks)
            START_DATE=$((NOW - ONE_WEEK))
            END_DATE=$((NOW + TWO_WEEKS))
            ;;
        1) # Upcoming projects (current + 1 week to current + 1 month)
            START_DATE=$((NOW + ONE_WEEK))
            END_DATE=$((NOW + ONE_MONTH))
            ;;
        2) # Closed projects (current - 1 month to current - 1 week)
            START_DATE=$((NOW - ONE_MONTH))
            END_DATE=$((NOW - ONE_WEEK))
            ;;
        3) # Mix of active/upcoming (current to current + 2 weeks)
            START_DATE=$((NOW))
            END_DATE=$((NOW + TWO_WEEKS))
            ;;
    esac
    
    # Convert image to hex using absolute path
    IMAGE_PATH="${SCRIPT_DIR}/projects/${i}.png"
    echo "Looking for image at: $IMAGE_PATH"
    if [ -f "$IMAGE_PATH" ]; then
        # Create a temporary file for the hex data
        HEX_TEMP_FILE=$(mktemp)
        xxd -p "$IMAGE_PATH" | tr -d '\n' > "$HEX_TEMP_FILE"
        IMAGE_DATA="blob \"$(cat $HEX_TEMP_FILE)\""
        rm "$HEX_TEMP_FILE"
    else
        IMAGE_DATA="null"
    fi
    
    # Create project data file
    PROJECT_DATA_FILE=$(create_project_data_file \
        "${TITLES[$i]}" \
        "${DESCRIPTIONS[$i]}" \
        "$START_DATE" \
        "$END_DATE" \
        "$RANDOM_REWARD" \
        "$IMAGE_DATA" \
        "${CATEGORIES[$(($i % 7))]}" \
        "$RANDOM_MAX_PARTICIPANTS" \
        "${IMPACTS[$IMPACT_INDEX]}" \
        "${ADDRESSES[$ADDRESS_INDEX]}"
    )
    
    # Create project using dfx
    echo "Creating project $(($i + 1))/4: ${TITLES[$i]}"
    dfx canister call backend createProject "$(cat $PROJECT_DATA_FILE)"
    
    # Clean up
    rm "$PROJECT_DATA_FILE"
done

echo "Successfully generated dummy projects!"

# Switch back to default identity
echo "Switching back to lumora identity..."
dfx identity use lumora