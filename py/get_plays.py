import sys

if __name__ == "__main__":
    team_code = sys.argv[1]
    f = open(sys.argv[2])

    old_game_id = None
    last_offence = None
    last_down = None
    play_successful = False
    q = []
    last_yard_line = None

    for l in f:
        l = l.strip().split(",")
        game_id = l[0]

        if old_game_id is None:
            old_game_id = game_id
        
        if old_game_id != game_id:
            print "new--game"
            #print "processing for game id : ", old_game_id
            old_game_id = game_id        
        else:
            offense = l[4]
            down = l[6]
            at_home = game_id.endswith("@"+team_code)
            quarter = l[1]
            mins = l[2]
            secs = l[3]

            off_score = int(l[10])
            try:
                def_score = int(l[11])
            except:
                def_score = 0

            if len(l[5]) == 0 or len(l[6]) == 0 or len(l[7]) == 0 or len(l[8]) == 0:
                continue

            starting_yard_line = int(l[8])
            down = int(l[6])
            play_successful = False

            if offense == team_code:
                if last_offence is None or last_offence != offense:
                    last_offence = offense

                if last_yard_line is None:
                    last_yard_line = starting_yard_line

                if last_down is None:
                    last_down = down

                if last_down is not None and last_down >= down and 10 <= last_yard_line - starting_yard_line:
                    print last_down, down, last_yard_line, starting_yard_line
                    play_successful = True
                    
                last_down = down
                last_yard_line = starting_yard_line

                is_losing = off_score < def_score

                if len(q) > 0:
                    v = q[0]
                    del q[0]
                    if play_successful:
                        v[9] = play_successful
                        play_successful = False
                    print " ".join(map(str,v))


                q.append([game_id, at_home, quarter, mins, secs, down, starting_yard_line, is_losing, off_score, play_successful])
                

            else:
                if last_offence == team_code:
                    last_offence = offense
                    print

    f.close()
