#!/bin/bash

# Railway Railpack Configuration Validator
# Validates railpack.json files to prevent bash built-in command issues

set -e

echo "🔍 Validating Railway Railpack configurations..."

# Check for bash built-ins that are not available in sh
BASH_BUILTINS=("enable" "source" "declare" "local" "export" "set" "unset")

# Find all railpack.json files
railpack_files=$(find . -name "railpack.json" -type f)

if [ -z "$railpack_files" ]; then
    echo "❌ No railpack.json files found"
    exit 1
fi

echo "📁 Found railpack.json files:"
echo "$railpack_files"
echo

# Validate JSON syntax
echo "🔧 Validating JSON syntax..."
for file in $railpack_files; do
    if jq empty "$file" 2>/dev/null; then
        echo "✅ $file - Valid JSON"
    else
        echo "❌ $file - Invalid JSON syntax"
        exit 1
    fi
done

echo

# Check for bash built-in commands
echo "🚫 Checking for bash built-in commands..."
found_issues=false

for file in $railpack_files; do
    echo "🔍 Checking $file..."
    
    # Extract command strings from the JSON
    commands=$(jq -r '.. | select(type == "string" and (contains("Command") or contains("command")))' "$file" 2>/dev/null || echo "")
    
    if [ -n "$commands" ]; then
        for builtin in "${BASH_BUILTINS[@]}"; do
            if echo "$commands" | grep -q "\\b$builtin\\b"; then
                echo "❌ Found bash built-in '$builtin' in $file"
                echo "   Commands containing '$builtin':"
                echo "$commands" | grep "$builtin" | sed 's/^/   /'
                found_issues=true
            fi
        done
    fi
done

if [ "$found_issues" = true ]; then
    echo
    echo "❌ Issues found! Railway uses /bin/sh which doesn't support bash built-ins."
    echo "💡 Solution: Use explicit commands like 'yarn install' instead of 'enable corepack && yarn install'"
    exit 1
fi

echo "✅ No bash built-in commands found"

# Check for explicit commands vs auto-generation
echo
echo "⚙️  Checking for explicit vs auto-generated commands..."

for file in $railpack_files; do
    echo "🔍 Analyzing $file..."
    
    # Check if services have explicit installCommand and buildCommand (where needed)
    services=$(jq -r '.services // {} | keys[]' "$file" 2>/dev/null || echo "")
    
    if [ -n "$services" ]; then
        for service in $services; do
            has_install=$(jq -r ".services.\"$service\".build.installCommand // empty" "$file")
            has_build=$(jq -r ".services.\"$service\".build.buildCommand // empty" "$file")
            
            if [ -z "$has_install" ]; then
                echo "⚠️  $service in $file: Missing explicit installCommand (may cause auto-generation)"
            else
                echo "✅ $service in $file: Has explicit installCommand"
            fi
            
            # Only frontend typically needs buildCommand
            if [[ "$service" == *"frontend"* ]] && [ -z "$has_build" ]; then
                echo "⚠️  $service in $file: Missing buildCommand (frontend should have build step)"
            elif [[ "$service" == *"frontend"* ]]; then
                echo "✅ $service in $file: Has explicit buildCommand"
            fi
        done
    fi
done

echo
echo "🎉 Railpack validation complete!"
echo
echo "📝 Best practices:"
echo "1. Always use explicit installCommand and buildCommand"
echo "2. Use 'yarn install --immutable' for reproducible builds"
echo "3. Avoid bash built-ins (enable, source, declare, etc.)"
echo "4. Test commands in /bin/sh environment, not bash"