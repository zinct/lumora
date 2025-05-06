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
    "1000 trees planted"
    "68 tons CO2 reduced"
    "1000 tons waste recycled"
    "200 kg of rice harvested"
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
    "Plant Trees in Bandung"
    "Research on Air Pollution in Jakarta" 
    "Recycle Waste in Yogyakarta"
    "Support Local Farmers in Surabaya"
)

# Sample project descriptions
DESCRIPTIONS=(
    "Plant trees in Bandung to help reduce air pollution and improve the environment. This project will involve monthly planting activities, weekly progress reports, and bi-weekly team meetings. We'll establish planting clusters focusing on AI ethics, blockchain applications, and sustainable tech solutions. Each participant will contribute to at least one research paper and present findings at our virtual symposium. The project aims to create a comprehensive knowledge base of emerging technologies and their societal implications. Through collaborative research, we'll explore ethical considerations, potential applications, and risk mitigation strategies. Regular workshops and expert sessions will be conducted to ensure high-quality research output. The final deliverables will include research papers, case studies, and policy recommendations that can guide future technological development."
    "Research on Air Pollution in Jakarta to help reduce air pollution and improve the environment. This project will involve monthly research activities, weekly progress reports, and bi-weekly team meetings. We'll establish research clusters focusing on AI ethics, blockchain applications, and sustainable tech solutions. Each participant will contribute to at least one research paper and present findings at our virtual symposium. The project aims to create a comprehensive knowledge base of emerging technologies and their societal implications. Through collaborative research, we'll explore ethical considerations, potential applications, and risk mitigation strategies. Regular workshops and expert sessions will be conducted to ensure high-quality research output. The final deliverables will include research papers, case studies, and policy recommendations that can guide future technological development."
    "Recycle waste in Yogyakarta to help reduce waste and improve the environment. This project will involve monthly recycling activities, weekly progress reports, and bi-weekly team meetings. We'll establish recycling clusters focusing on AI ethics, blockchain applications, and sustainable tech solutions. Each participant will contribute to at least one research paper and present findings at our virtual symposium. The project aims to create a comprehensive knowledge base of emerging technologies and their societal implications. Through collaborative research, we'll explore ethical considerations, potential applications, and risk mitigation strategies. Regular workshops and expert sessions will be conducted to ensure high-quality research output. The final deliverables will include research papers, case studies, and policy recommendations that can guide future technological development."
    "Support local farmers in Surabaya to help improve the environment and improve the economy. This project will involve monthly farming activities, weekly progress reports, and bi-weekly team meetings. We'll establish farming clusters focusing on AI ethics, blockchain applications, and sustainable tech solutions. Each participant will contribute to at least one research paper and present findings at our virtual symposium. The project aims to create a comprehensive knowledge base of emerging technologies and their societal implications. Through collaborative research, we'll explore ethical considerations, potential applications, and risk mitigation strategies. Regular workshops and expert sessions will be conducted to ensure high-quality research output. The final deliverables will include research papers, case studies, and policy recommendations that can guide future technological development."
)

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
    
    # Create project using dfx
    echo "Creating project $(($i + 1))/30: ${TITLES[$i]}"
    dfx canister call backend createProject "record { 
        title = \"${TITLES[$i]}\"; 
        description = \"${DESCRIPTIONS[$i]}\"; 
        startDate = ${START_DATE}; 
        expiredAt = ${END_DATE}; 
        reward = ${RANDOM_REWARD}; 
        imageUrl = null; 
        category = variant { ${CATEGORIES[$(($i % 7))]} }; 
        maxParticipants = ${RANDOM_MAX_PARTICIPANTS};
        impact = \"${IMPACTS[$IMPACT_INDEX]}\";
        address = \"${ADDRESSES[$ADDRESS_INDEX]}\"
    }"
done

echo "Successfully generated dummy projects!"

# Switch back to default identity
echo "Switching back to lumora identity..."
dfx identity use lumora