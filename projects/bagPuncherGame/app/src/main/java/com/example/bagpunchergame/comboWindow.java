package com.example.bagpunchergame;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.DisplayMetrics;
import android.view.Window;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;


public class comboWindow extends AppCompatActivity {

    private int hits = 0;
    private static int passiveHitsTimer = 60000;
    private static int punchWorth = 1;
    private static int passivePunch = 1;




    @SuppressLint("SetTextI18n")
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.combos_layout);

        SharedPreferences sp = getApplicationContext().getSharedPreferences("upgrades", Context.MODE_PRIVATE);

        Button hitWorthPlusOne = findViewById(R.id.upgrade1);
        Button autoHitPlusOne = findViewById(R.id.upgrade2);
        Button hitTimerDecrease = findViewById(R.id.upgrade3);
        ImageButton backButton = findViewById(R.id.backButton);

        EditText hitVal = findViewById(R.id.hitVal);
        EditText passiveVal = findViewById(R.id.autoHitVal);
        EditText passiveTimer = findViewById(R.id.hitTimer);

        TextView totalHits = findViewById(R.id.totalHits);
        TextView hitWorthPrice = findViewById(R.id.hitWorthPrice);
        TextView autoHitPrice = findViewById(R.id.autoHitPrice);
        TextView incrementPrice = findViewById(R.id.hitTimerPrice);


        hits = sp.getInt("totalHits", MainActivity.getHits());
        totalHits.setText(String.valueOf(hits));


        hitWorthPlusOne.setOnClickListener(v -> {
            if(Integer.valueOf((String) hitWorthPrice.getText()) <= MainActivity.getHits()){
                MainActivity.increaseHitWorth();
                punchWorth++;
                sp.edit().putInt("hitValue", punchWorth);
                punchWorth = sp.getInt("hitValue", punchWorth);
                hitVal.setText(String.valueOf(sp.getInt("hitValue", punchWorth)));
                hits = hits - Integer.valueOf((String) hitWorthPrice.getText());
                totalHits.setText(String.valueOf(hits));
                MainActivity.decreaseHits(Integer.valueOf((String) hitWorthPrice.getText()));
                return;
            }
            else
                return;

        });

        autoHitPlusOne.setOnClickListener(v -> {
            if(Integer.valueOf((String) autoHitPrice.getText()) <= MainActivity.getHits()) {
                MainActivity.increasePassiveHit();
                passivePunch++;
                sp.edit().putInt("passiveValue", passivePunch);
                passivePunch = sp.getInt("passiveValue", passivePunch);
                passiveVal.setText(String.valueOf(sp.getInt("passiveValue", passivePunch)));
                hits = hits - Integer.valueOf((String) autoHitPrice.getText());
                totalHits.setText(String.valueOf(hits));
                MainActivity.decreaseHits(Integer.valueOf((String) autoHitPrice.getText()));
                return;
            }
            else
                return;
        });

        hitTimerDecrease.setOnClickListener(v -> {
            MainActivity.decreaseHitIncrementer();
            passiveHitsTimer = passiveHitsTimer - 5000;
            sp.edit().putInt("passiveTimer", passiveHitsTimer);
            passiveHitsTimer = sp.getInt("passiveTimer", passiveHitsTimer);
            passiveTimer.setText(String.valueOf(sp.getInt("passiveTimer", passiveHitsTimer/1000)));
            return;
        });


        backButton.setOnClickListener(v -> {
            Intent intent = new Intent(this, MainActivity.class);
            intent.addFlags(Intent.FLAG_ACTIVITY_REORDER_TO_FRONT);
            startActivity(intent);
        });
    }

    protected void onResume(){
        super.onResume();
        SharedPreferences sp = getApplicationContext().getSharedPreferences("upgrades", Context.MODE_PRIVATE);
        TextView totalHits = findViewById(R.id.totalHits);


        hits = sp.getInt("totalHits", MainActivity.getHits());
        totalHits.setText(String.valueOf(hits));
    }
}
