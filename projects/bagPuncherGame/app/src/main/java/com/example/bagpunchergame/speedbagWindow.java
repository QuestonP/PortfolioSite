package com.example.bagpunchergame;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.os.CountDownTimer;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;

import java.util.Timer;
import java.util.TimerTask;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import static java.util.concurrent.TimeUnit.SECONDS;


public class speedbagWindow extends AppCompatActivity {

    static int scoreAccumulated = 0, playTimer = 5;
    Button speedbag;
    ImageButton backButton;
    TextView score, directions, roundFinish;
    Animation sbStart, rotateBag;
    TextView time;
    CountDownTimer timer;
    SharedPreferences sp;
    Thread thread;


    public static int getSpeedbagHits(){
        return scoreAccumulated;
    }
    public static int getPlayTimer(){return playTimer; }
    public static void setPlayTimer(int t){ playTimer = t; }



    @SuppressLint("ClickableViewAccessibility")
    protected void onCreate(Bundle savedInstanceState){
        super.onCreate(savedInstanceState);
        setContentView(R.layout.speedbag_layout);

        SharedPreferences sp = getApplicationContext().getSharedPreferences("speedbagPoints", Context.MODE_PRIVATE);
        sbStart = AnimationUtils.loadAnimation(this, R.anim.display_punch_worth);
        speedbag = findViewById(R.id.speedbagButton);
        score = findViewById(R.id.score);
        backButton = findViewById(R.id.backButton);
        directions = findViewById(R.id.pageDirections);
        rotateBag = AnimationUtils.loadAnimation(this, R.anim.speedbag_animation);
        time = findViewById(R.id.playTimer);
        roundFinish = findViewById(R.id.finishRound);
        playTimer = 5;


        directions.startAnimation(sbStart);
        speedbag.startAnimation(rotateBag);



         thread = new Thread() {

            @Override
            public void run() {
                try {
                    while (!thread.isInterrupted()) {
                        Thread.sleep(1000);
                        runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                time.setText(String.valueOf(playTimer));
                                playTimer -= 1;
                                if(playTimer < 0) {
                                    roundFinish.startAnimation(sbStart);
                                    finish();
                                }
                                }

                        });
                    }

                } catch (InterruptedException e) {
                }
            }


        };

        thread.start();

        backButton.setOnClickListener(v -> {
            Intent intent = new Intent(this, MainActivity.class);
            intent.addFlags(Intent.FLAG_ACTIVITY_REORDER_TO_FRONT);
            startActivity(intent);
        });

        speedbag.setOnTouchListener((v,e)->{
            scoreAccumulated++;
            score.setText(String.valueOf(scoreAccumulated));
            sp.edit().putInt("speedbagPoints", scoreAccumulated);
            return false;
        });
    }

    protected void onStop(){
        super.onStop();
        scoreAccumulated = 0;
    }
}
