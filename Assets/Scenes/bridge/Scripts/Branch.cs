using UnityEngine;
using System.Collections;

public class Branch : MonoBehaviour
{
    public float TIMEVALMIN = 10;
    public float TIMEVALMAX = 30;

    float TIMEVAL;
    float timer;

//
// Touch tree branch
//
void TouchBranch()
    {
        ParticleSystem snow = this.gameObject.transform.GetChild(0).GetComponent<ParticleSystem>();
        snow.Play();

        Rigidbody2D branch = GetComponent<Rigidbody2D>();
        branch.isKinematic = false;
        branch.AddForce(new Vector2(0, 15));
    }

    void Start()
    {
        TIMEVAL = TIMEVALMIN;
        timer = 0;
    }

    //
    // Mouse
    //
    void OnMouseDown()
    {
        TouchBranch();
    }

    //
    // Timer
    //
    void CheckTimers()
    {
        // Check branch timer
        timer += Time.deltaTime;
        if (timer >= TIMEVAL)
        {
            TouchBranch();

            timer = 0;
            TIMEVAL = Random.Range(TIMEVALMIN, TIMEVALMAX);
            Debug.Log("On timer !");
        }
    }

    //
    // Update
    //
    void Update()
    {
        CheckTimers();
    }
}
