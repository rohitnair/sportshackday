import sys
import json

if __name__ == "__main__":
    team_code = sys.argv[1]
    f = open(sys.argv[2])

    plays = {}
    plays_down = {}
    last_win = None
    play_yards = {}
    play_score = {}
    play_is_losing = {}
    play_at_home = {}


    for l in f:
        l = l.strip()

        l = l.split()

        if len(l) != 10:
            continue

        play_win = l[9] == "True"
        qrtr = int(l[2])
        down = int(l[5])
        yards = int(l[6])
        score = int(l[8])
        is_playing_at_home = l[1] == "True"
        is_losing = l[7] == "True"

        if qrtr not in plays:
            plays[qrtr] = {}
            plays[qrtr][True] = 0
            plays[qrtr][False] = 0

        if down not in plays_down:
            plays_down[down] = {}
            plays_down[down][True] = 0
            plays_down[down][False] = 0


        low = int(yards / 10) * 10
        high = (int(yards / 10) + 1) * 10
        low1 = int(score / 10) * 10
        high1 = (int(score / 10) + 1) * 10


        if (low,high) not in play_yards:
            play_yards[(low,high)] = {}
            play_yards[(low,high)][True] = 0
            play_yards[(low,high)][False] = 0

        play_yards[(low,high)][play_win] += 1
        

        if (low1,high1) not in play_score:
            play_score[(low1,high1)] = {}
            play_score[(low1,high1)][True] = 0
            play_score[(low1,high1)][False] = 0

        play_score[(low1,high1)][play_win] += 1


        if is_playing_at_home not in play_at_home:
            play_at_home[is_playing_at_home] = 0

        if is_losing not in play_is_losing:
            play_is_losing[is_losing] = 0

        plays[qrtr][play_win] += 1
        plays_down[down][play_win] += 1
        play_is_losing[is_losing] += 1
        play_at_home[is_playing_at_home] += 1

            
    f.close()

    r = {}
    r['team'] = team_code
    r['pr_of_conversion'] = {}
    r['pr_of_conversion']['quarter'] = {}
    r['pr_of_conversion']['yards'] = {}
    r['pr_of_conversion']['score'] = {}
    r['pr_of_conversion']['is_losing'] = {}
    r['pr_of_conversion']['at_home'] = {}
    r['pr_of_conversion']['down'] = {}

    #print plays 

    s = 0
    for k,v in plays_down.iteritems():
        r['pr_of_conversion']['quarter'][k] = float(plays[k][True])  / float(plays[k][True] + plays[k][False])

    #print plays_down

    s = 0
    for k,v in plays_down.iteritems():
        r['pr_of_conversion']['down'][k] = float(plays_down[k][True]) / float(plays_down[k][True] + plays_down[k][False])

    #print play_yards

    s = 0
    for k,v in play_yards.iteritems():
        r['pr_of_conversion']['yards'][str(k)] = float(play_yards[k][True]) / float(play_yards[k][True] + play_yards[k][False])

    #print play_score

    s = 0
    for k,v in play_score.iteritems():
        r['pr_of_conversion']['score'][str(k)] = float(play_score[k][True]) /  float(play_score[k][True] + play_score[k][False])


    r['pr_of_conversion']['is_losing'] = float(play_is_losing[True]) / float(play_is_losing[True] + play_is_losing[False])
    r['pr_of_conversion']['at_home'] = float(play_at_home[True]) / float(play_at_home[True] + play_at_home[False])

    print json.dumps(r,indent=2)


