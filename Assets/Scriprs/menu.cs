using UnityEngine;
using System.Collections;

public class menu : MonoBehaviour {

    static GameObject MainPanel = null;
    static GameObject InfoPanel = null;

    // Start
    void Start()
    {
        Debug.Log("Menu start !");

        if (MainPanel == null)
        {
            MainPanel = GameObject.Find("MainPanel");
        }

        // Show info permanetly
        /* 
        if (InfoPanel == null)
        {
            InfoPanel = GameObject.Find("InfoPanel");
            if (InfoPanel != null)
            {
                InfoPanel.SetActive(false);
            }
        }*/
    }

    // Update
    void Update()
    {
        if (Input.GetKeyDown(KeyCode.Escape))
        {
            Application.LoadLevel("main");
        }
    }

    // 
    // Process  main menu selections
    //
    public void OnIslands()
    {
        Debug.Log("Islands !");

        Application.LoadLevel("islands");
        MainPanel.SetActive(false);
    }

    public void OnParrot()
    {
        Debug.Log("Parrot !");

        Application.LoadLevel("parrot");
        MainPanel.SetActive(false);
    }

    public void OnBridge()
    {
        Debug.Log("Bridge !");

        Application.LoadLevel("bridge");
        MainPanel.SetActive(false);
    }

    public void OnFlights()
    {
        Debug.Log("Flights !");

        Application.LoadLevel("flights");
        MainPanel.SetActive(false);
    }

    public void OnFetch()
    {
        Debug.Log("Fetch !");

        Application.LoadLevel("Fetch");
        MainPanel.SetActive(false);
    }

    public void OnTfto()
    {
        Debug.Log("Tfto !");

        Application.LoadLevel("Tfto");
        MainPanel.SetActive(false);
    }

    public void OnShowInfo()
    {
        if (InfoPanel.activeSelf)
        {
            InfoPanel.SetActive(false);
            Debug.Log("HideInfo !");
        }
        else
        {
            InfoPanel.SetActive(true);
            Debug.Log("Shown !");
        }
    }
}
