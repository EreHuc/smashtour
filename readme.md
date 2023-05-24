# Smashtour

A monopoly / business tour for super smash bros ultimate

Available game at: https://smashmonopoly.netlify.app/

## Rules

### Player turn order is chosen randomly at the beginning of the game
### 1. Each player roll dice and land on a square
  - Property
    - If no one own the property you play the corresponding character with no handicap
    - If you own the property you play the corresponding character with no handicap
    - If an opponent own the property you play the corresponding character with an handicap define by the color of property
    - If an opponent own the property and the set of property with the same color you play the corresponding character with an handicap define by the color of property plus 50% ( rounded )
  - Station
    - If no one own the Station you play the corresponding character with no handicap
    - If you own the Station you play the corresponding character with no handicap
    - If an opponent own the Station you play the corresponding character with an handicap define by the number of Station own by the opponent
  - Chance
    - Draw a chance card and play the corresponding character with no handicap
  - Jail
    - Play the corresponding character with no handicap
  - Parking
    - Own all property lost in taxes
    - Play the corresponding character with no handicap
  - Go to Jail
    - You go to jail and plays the character as if you landed on Jail, but you're jailed this time
  - Tax
    - Play the corresponding character with no handicap
  - Start
    - Own a random character
    - Play the corresponding character with no handicap

### 2. Fight with the opponent and the handicap that is assign to you

### 3. Select the winner

#### If you loose
  - On a property with 2 houses owned by the winner
    - You lost a random non-locked property
  - On a property with an hotel owned by the winner
    - The winner chose a non-locked property to steal
  - On tax
    - You lost a random non-locked property

#### If you win
  - If you were jailed
    - You are free from jail
  - On chance, jail when not jailed, start and parking
    - You win a random property, if no property to win upgrade one of yours
  - On a not own property
    - This property is now yours, congratulation !
  - On a property own by you
    - Upgrade your property level by 1 (expect station) to a maximum of an hotel
  - Others case
    - Select a property to upgrade

### 4. End of the turn
  - 2 players
    - if you own 3 set of property you win ( all station own count as 1 )
  - 3 players
    - if you own 2 set of property you win ( all station own count as 1 )
  - 4 players
    - if you own 1 set of property you win ( all station own count as 1 )
  - If no-one win
    - Next turn, first player roll the dice

## Jail rules
  - If you roll a double you are free
  - If you win a fight you are free
  - If you stay more than 3 turn you are free 

## How to lock property
  - Own all the property with same color ( or all station ) and those property will be locked
## Cards
  - Free jail can be used by clicking on the card when in jail
  - Free character can be use by clicking on the card when rolling dice or before choosing winner

## Credits
Based on https://smashmonopoly.com made by [Little Z](https://www.youtube.com/c/LittleZubat) and [El Xando](https://www.youtube.com/ElXando1993)
